import { resolve } from "path";
import type { UserConfig } from "vite";
import { defineConfig, mergeConfig } from "vite";
import { readPackageJSON } from "pkg-types";
import dts from "vite-plugin-dts";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import libAssets from "@laynezh/vite-plugin-lib-assets";
import { commonConfig, type DefineOptions } from "./common";

export interface PackageDefineOptions extends DefineOptions {
  options?: {
    enableDts: boolean;
    /** Library entry file, defaults to "src/index.ts" */
    entry?: string;
  };
}

function definePackageConfig(defineOptions: PackageDefineOptions = {}) {
  const { overrides = {}, options = { enableDts: true } } = defineOptions;
  const { entry = "src/index.ts" } = options;
  const root = process.cwd();

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
          entry,
          formats: ["es"],
        },
        rolldownOptions: {
          input: [entry],
          output: {
            format: "es",
            dir: "dist",
            entryFileNames: "[name].js",
            preserveModules: true,
            preserveModulesRoot: "src",
          },
          external: [
            ...Object.keys(dependencies),
            ...Object.keys(devDependencies),
            ...Object.keys(peerDependencies),
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
        options.enableDts &&
          dts({
            rollupTypes: true,
            logLevel: "error",
          }),
        libAssets({
          name: "[name].[contenthash:8].[ext]",
          limit: 0,
        }),
      ],
    };
    const mergedConfig = mergeConfig(commonConfig(mode), packageConfig);
    return mergeConfig(mergedConfig, overrides);
  });
}

export { definePackageConfig };
