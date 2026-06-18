import type { UserConfig } from "vite";
import {
  defineConfig,
  loadEnv,
  mergeConfig,
  searchForWorkspaceRoot,
} from "vite";
import dayjs from "dayjs";
import { resolve } from "path";
import { readPackageJSON } from "pkg-types";
import { OUTPUT_DIR } from "./constants";
import { configVitePlugins } from "../plugins";
import { resolveProxy, wrapperEnv } from "../utils";
import { commonConfig, DefineOptions } from "./common";

function defineApplicationConfig(defineOptions: DefineOptions = {}) {
  const { overrides = {} } = defineOptions;
  const root = process.cwd();

  return defineConfig(async ({ mode }) => {
    const env = loadEnv(mode, root);
    const { dependencies, devDependencies, name, version } =
      await readPackageJSON(root);

    const viteEnv = wrapperEnv(env);
    const {
      VITE_PUBLIC_PATH,
      VITE_PROXY,
      VITE_PROXY_OPTIONS,
      VITE_USE_MOCK,
      VITE_DROP_CONSOLE,
      VITE_USE_HTTPS,
    } = viteEnv;
    const applicationConfig: UserConfig = {
      root,
      base: VITE_PUBLIC_PATH,
      resolve: {
        alias: {
          "@": `${resolve(root, "src")}`,
          "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
          vue: "vue/dist/vue.esm-bundler.js",
        },
      },
      define: {
        __VITE_USE_MOCK__: VITE_USE_MOCK,
        __INTLIFY_PROD_DEVTOOLS__: false,
        __APP_INFO__: JSON.stringify({
          pkg: { dependencies, devDependencies, name, version },
          lastBuildTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        }),
      },
      server: {
        hmr: true,
        cors: true,
        port: 3000,
        host: true,
        proxy: !VITE_USE_HTTPS
          ? resolveProxy(VITE_PROXY, VITE_PROXY_OPTIONS)
          : undefined,
        fs: {
          strict: false,
          allow: [searchForWorkspaceRoot(process.cwd()), ".."],
        },
      },
      preview: {
        cors: true,
        port: 4000,
        host: true,
        proxy: !VITE_USE_HTTPS
          ? resolveProxy(VITE_PROXY, VITE_PROXY_OPTIONS)
          : undefined,
      },
      esbuild: {
        pure: VITE_DROP_CONSOLE ? ["console.log", "debugger"] : [],
      },
      build: {
        outDir: OUTPUT_DIR,
        reportCompressedSize: false,
        chunkSizeWarningLimit: 1024,
        rolldownOptions: {
          output: {
            manualChunks: {},
          },
        },
      },
      optimizeDeps: {
        include: ["dayjs/locale/en", "dayjs/locale/zh-cn"],
      },
      plugins: await configVitePlugins(
        root,
        viteEnv,
        ["production", "prod"].includes(mode),
      ),
    };
    const mergedConfig = mergeConfig(commonConfig(mode), applicationConfig);
    return mergeConfig(mergedConfig, overrides);
  });
}

export { defineApplicationConfig };
