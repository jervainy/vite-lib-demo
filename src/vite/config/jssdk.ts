import { resolve } from "path";
import { readPackageJSON } from "pkg-types";
import {
  BuildOptions,
  defineConfig,
  mergeConfig,
  minify,
  type UserConfig,
} from "vite";
import dts from "vite-plugin-dts";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { commonConfig } from "./common";

interface DefineOptions {
  overrides?: UserConfig;
  options?: {};
}

function defineJSSDKConfig(defineOptions: DefineOptions = {}, debug = false) {
  const { overrides = {} } = defineOptions;
  const root = process.cwd();

  return defineConfig(async ({ mode }) => {
    const { devDependencies, peerDependencies } = await readPackageJSON(root);

    const debugBuild = {
      minify: false,
      sourcemap: false,
      cssCodeSplit: false,
      lib: {
        entry: "src/index.ts",
        formats: ["es"],
      },
      rollupOptions: {
        input: ["src/index.ts"],
        output: {
          format: "es",
          dir: "dist",
          entryFileNames: "[name].js",
          preserveModules: true,
          preserveModulesRoot: "src",
        },
        external: [
          ...Object.keys(devDependencies),
          ...Object.keys(peerDependencies),
          /dcp-design/,
          /element-plus/,
        ],
      },
    };

    const prodBuild = {
      lib: {
        entry: "src/index.ts",
        formats: ["es"],
        name: "jssdk",
        fileName: "jssdk",
      },
      minify: "esbuild",
      sourcemap: true,
      outDir: "./dist",
      rollupOptions: {
        external: [
          ...Object.keys(devDependencies),
          ...Object.keys(peerDependencies),
          /dcp-design/,
          /element-plus/,
        ],
      },
    };

    const packageConfig: UserConfig = {
      resolve: {
        alias: {
          "@": `${resolve(root, "src")}`,
        },
      },
      build: (debug ? debugBuild : prodBuild) as BuildOptions,
      plugins: [
        vue({
          template: {
            compilerOptions: {
              isCustomElement: (tag) => tag.startsWith("dcp-jssdk-"),
            },
          },
        }),
        vueJsx(),
        dts({
          rollupTypes: true,
          logLevel: "error",
        }),
      ],
    };
    const mergedConfig = mergeConfig(commonConfig(mode), packageConfig);
    return mergeConfig(mergedConfig, overrides);
  });
}

export { defineJSSDKConfig };
