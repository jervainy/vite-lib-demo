import { resolve } from "path";
import { readPackageJSON } from "pkg-types";
import { defineConfig, mergeConfig, type UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { commonConfig, type DefineOptions } from "./common";

export interface PackageDefineOptions extends DefineOptions {
  options?: DefineOptions["options"] & {
    entry?: string | Record<string, string>;
  };
}

function definePackageConfig(defineOptions: PackageDefineOptions = {}) {
  const overrides = defineOptions.overrides ?? {};
  const root = process.cwd();
  const entry = defineOptions.options?.entry ?? "src/index.ts";
  const entries = typeof entry === "string" ? { index: entry } : entry;

  return defineConfig(async ({ mode }) => {
    const { dependencies, devDependencies, peerDependencies } =
      await readPackageJSON(root);

    const packageConfig: UserConfig = {
      root,
      base: "./",
      resolve: {
        alias: {
          "@": `${resolve(root, "src")}`,
        },
      },
      build: {
        minify: false,
        sourcemap: false,
        cssCodeSplit: false,
        lib: {
          entry: entries,
        },
        rolldownOptions: {
          input: Object.values(entries),
          output: [
            {
              format: "es",
              preserveModules: true,
              preserveModulesRoot: "src",
              entryFileNames: "[name].mjs",
            },
            {
              format: "cjs",
              preserveModules: true,
              preserveModulesRoot: "src",
              entryFileNames: "[name].cjs",
            },
          ],
          external: [
            ...Object.keys(dependencies ?? {}),
            ...Object.keys(devDependencies ?? {}),
            ...Object.keys(peerDependencies ?? {}),
          ],
        },
      },
      plugins: [
        vue({
          template: {
            compilerOptions: {
              isCustomElement: (tag) => tag.startsWith("micro-app"),
            },
          },
        }),
        vueJsx(),
      ],
    };
    const mergedConfig = mergeConfig(commonConfig(mode), packageConfig);
    return mergeConfig(mergedConfig, overrides);
  });
}

export { definePackageConfig };
