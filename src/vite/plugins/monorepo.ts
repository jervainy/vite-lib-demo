import type { Alias, Plugin } from "vite";
import fs from "fs";
import path from "path";
import glob from "fast-glob";
import pic from "picocolors";

const { bold, cyan, gray, green } = pic;

// 多叉树的类型定义
class TreeNode<T> {
  // 节点值
  val?: T;
  // 节点路径
  path: string;
  // 树路径
  treePath: string[];
  // 子节点
  children: TreeNode<T>[];

  constructor(path?: string, val?: T, parentNode?: TreeNode<T>) {
    this.val = val;
    this.path = path || "";
    this.children = [];
    if (parentNode) {
      if (parentNode.isRoot()) {
        this.treePath = [];
      } else {
        this.treePath = [...parentNode.treePath, parentNode.path];
      }
    } else {
      this.treePath = [];
    }
  }

  // 是否是根节点
  isRoot(): boolean {
    return this.treePath.length === 0 && this.path === "";
  }

  // 添加子节点
  addChild(child: TreeNode<T>) {
    this.children.push(child);
  }

  // 删除子节点
  removeChild(child: TreeNode<T>) {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
    }
  }

  // 是否是目标节点
  isNodeValEqual(val: T): boolean {
    return this.val === val;
  }

  // 深度优先查找
  dfs(val: T): TreeNode<T> | null {
    if (this.isNodeValEqual(val)) {
      return this;
    }
    for (let i = 0; i < this.children.length; i++) {
      const node = this.children[i].dfs(val);
      if (node) {
        return node;
      }
    }
    return null;
  }

  /**
   * 按路径查询
   * @param paths 路径数组
   * @param createWhenNotFound 路径数组
   * @returns
   */
  findByPath(
    paths: string[],
    createWhenNotFound = false,
    _parentNode?: TreeNode<T>,
  ): TreeNode<T> | null {
    for (let i = 0; i < paths.length; i++) {
      const [currentPath, ...nextPaths] = paths;
      const child = this.children.find((node) => node.path === currentPath);
      if (child) {
        if (nextPaths.length === 0) {
          return child;
        } else {
          return child.findByPath(nextPaths, createWhenNotFound);
        }
      } else if (createWhenNotFound) {
        const childNode = new TreeNode<T>(currentPath, undefined, this);
        this.addChild(childNode);
        if (nextPaths.length === 0) {
          return childNode;
        } else {
          return childNode.findByPath(nextPaths, createWhenNotFound);
        }
      } else {
        return null;
      }
    }
    return null;
  }
}

export type Options = Omit<Alias, "customResolver">;
/** Cache for package.json resolution and package.json contents */
export type PackageCache = Map<string, PackageData>;

export interface PackageData {
  dir: string;
  componentCache: TreeNode<string>;
  data: {
    [field: string]: any;
    name: string;
    type: string;
    version: string;
    main: string;
    module: string;
    browser: string | Record<string, string | false>;
    exports: string | Record<string, any> | string[];
    imports: Record<string, any>;
    dependencies: Record<string, string>;
  };
}

export function loadPackageData(pkgPath: string): PackageData {
  const data = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const pkgDir = path.dirname(pkgPath);
  const pkg: PackageData = {
    dir: pkgDir,
    componentCache: new TreeNode<string>(),
    data,
  };
  return pkg;
}

export function findNearestPackageData(
  basedir: string,
  packageCache?: PackageCache,
): PackageData | null {
  const originalBasedir = basedir;
  while (basedir) {
    if (packageCache) {
      const cached = getFnpdCache(packageCache, basedir, originalBasedir);
      if (cached) return cached;
    }

    const pkgPath = path.join(basedir, "package.json");
    try {
      if (fs.statSync(pkgPath, { throwIfNoEntry: false })?.isFile()) {
        const pkgData = loadPackageData(pkgPath);

        if (packageCache) {
          setFnpdCache(packageCache, pkgData, basedir, originalBasedir);
        }

        return pkgData;
      }
    } catch {}

    const nextBasedir = path.dirname(basedir);
    if (nextBasedir === basedir) break;
    basedir = nextBasedir;
  }

  return null;
}

/**
 * Get cached `findNearestPackageData` value based on `basedir`. When one is found,
 * and we've already traversed some directories between `basedir` and `originalBasedir`,
 * we cache the value for those in-between directories as well.
 * This makes it so the fs is only read once for a shared `basedir`.
 */
function getFnpdCache(
  packageCache: PackageCache,
  basedir: string,
  originalBasedir: string,
) {
  const cacheKey = getFnpdCacheKey(basedir);
  const pkgData = packageCache.get(cacheKey);
  if (pkgData) {
    traverseBetweenDirs(originalBasedir, basedir, (dir) => {
      packageCache.set(getFnpdCacheKey(dir), pkgData);
    });
    return pkgData;
  }

  return null;
}

function setFnpdCache(
  packageCache: PackageCache,
  pkgData: PackageData,
  basedir: string,
  originalBasedir: string,
) {
  packageCache.set(getFnpdCacheKey(basedir), pkgData);
  traverseBetweenDirs(originalBasedir, basedir, (dir) => {
    packageCache.set(getFnpdCacheKey(dir), pkgData);
  });
}

// package cache key for `findNearestPackageData`
function getFnpdCacheKey(basedir: string): string {
  return `fnpd_${basedir}`;
}

/**
 * Traverse between `longerDir` (inclusive) and `shorterDir` (exclusive) and call `cb` for each dir.
 * @param longerDir Longer dir path, e.g. `/User/foo/bar/baz`
 * @param shorterDir Shorter dir path, e.g. `/User/foo`
 */
function traverseBetweenDirs(
  longerDir: string,
  shorterDir: string,
  cb: (dir: string) => void,
) {
  while (longerDir !== shorterDir) {
    cb(longerDir);
    longerDir = path.dirname(longerDir);
  }
}

/**
 * 创建别名解析规则
 * @param config
 * @param env
 * @param options
 * @returns
 */
export const createAlias = (options: Options): Alias => {
  return {
    ...options,
    customResolver(updatedId, importerId, _resolveOptions) {
      const pkgData = findNearestPackageData(importerId || "");
      if (!pkgData) {
        throw new Error(
          `MonoRepoResolverPlugin can not resolve Module from: ${importerId}`,
        );
      }
      // 组件包路径
      let pkgPath = pkgData.dir;
      const dirPath = path.parse(pkgPath);
      let baseRoot = dirPath.root;
      if (baseRoot) {
        // 处理Root路径
        if (process.platform === "win32") {
          // E://aaa/bbb/
          // baseRoot = E:
          baseRoot = baseRoot.replace(path.sep, "");
          // /aaa/bbb
          pkgPath = pkgPath.replace(baseRoot, "");
          // baseRoot = E:/
          baseRoot = baseRoot + "/";
        }
      }

      // Pkg的根路径分割结果
      const paths = pkgPath.split(path.sep).filter((p) => p !== "");
      // 分割别名对应的相对路径路径。代码实际导入的时候都会使用'/'，不需要使用Path.sep
      const componentPaths = updatedId.split("/").filter((p) => p !== "");
      const componentNode = pkgData.componentCache.findByPath(
        componentPaths,
        true,
      );
      if (componentNode) {
        if (!componentNode.val) {
          let realPath;
          const componentPath =
            baseRoot + [...paths, ...componentPaths].join("/");
          if (fs.existsSync(componentPath)) {
            // import路径存在，确定是文件还是文件夹，分别处理
            if (fs.statSync(componentPath).isDirectory()) {
              // 如果导入的是文件夹，文件加载应该有index.xxx的入口文件
              const components = glob.sync(`${componentPath}/index.*`, {
                onlyFiles: true,
                deep: 1,
                caseSensitiveMatch: false,
              });
              if (components.length === 1) {
                realPath = components[0];
              } else {
                // vue和js(ts|js)同时存在优先(js|ts)
                const fileTsOrJs = components.find(
                  (c) => c.endsWith(".ts") || c.endsWith(".js"),
                );
                if (fileTsOrJs) {
                  realPath = fileTsOrJs;
                } else {
                  throw new Error(
                    `MonoRepoResolverPlugin can not resolve Module ${updatedId} at: ${importerId}, find ${components.length === 0 ? "none" : "multiple"} files at: ${componentPath}/index.(ts|js), please check it. components: ${components}`,
                  );
                }
              }
            } else {
              // 如果导入的是文件，直接使用
              realPath = componentPath;
            }
          } else {
            // import文件不存在，需要进一步处理，尝试直接搜索相关文件
            const components = glob.sync(`${componentPath}.*`, {
              onlyFiles: true,
              deep: 1,
              caseSensitiveMatch: false,
              cwd: path.resolve(componentPath, "../"),
            });
            if (components.length === 1) {
              realPath = components[0];
            } else {
              throw new Error(
                `MonoRepoResolverPlugin can not resolve Module ${updatedId} at: ${importerId}, find ${components.length === 0 ? "none" : "multiple"} files at: ${componentPath}, please check it. components: ${components}`,
              );
            }
          }
          componentNode.val = realPath;
          console.debug(
            `${bold(cyan("[MonoRepoResolverPlugin]"))} ${green(`resolve Component from "${updatedId}" to ${realPath} at: `)} ${gray(importerId)}`,
          );
        }
        return componentNode.val;
      } else {
        throw new Error(
          `MonoRepoResolverPlugin can not resolve Module at: ${importerId}, cache module tree is empty`,
        );
      }
    },
  };
};

/**
 * 导出Vite插件
 * @param rawOptions
 * @returns
 */
export default function configMonoRepoResolverPlugin(
  rawOptions: Options = {
    find: "#",
    replacement: "src",
  },
): Plugin {
  return {
    name: "MonoRepoResolver",
    config: () => ({
      resolve: {
        alias: [createAlias(rawOptions)],
      },
    }),
  };
}
