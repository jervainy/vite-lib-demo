import type { PluginOption } from "vite";
import type { ViteEnv } from "../utils";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import legacy from "@vitejs/plugin-legacy";
import purgeIcons from "vite-plugin-purge-icons";
import { configChunkSplitPlugin } from "./chunk-split";
import { configHtmlPlugin } from "./html";
import { configCompressPlugin } from "./compress";
import { createConfigPlugin } from "./config";

export async function configVitePlugins(
  root: string,
  viteEnv: ViteEnv,
  isBuild: boolean,
) {
  const {
    VITE_LEGACY,
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
  } = viteEnv;

  const vitePlugins: (PluginOption | PluginOption[])[] = [
    // handle .vue files
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("micro-app"),
        },
      },
    }),
    vueJsx(),
  ];

  // @vitejs/plugin-legacy
  VITE_LEGACY && isBuild && vitePlugins.push(legacy());

  vitePlugins.push(configChunkSplitPlugin());

  // vite-plugin-html
  vitePlugins.push(await configHtmlPlugin(root, viteEnv, isBuild));

  vitePlugins.push(createConfigPlugin());

  // vite-plugin-purge-icons
  vitePlugins.push(purgeIcons());

  // The following plugins only work in the production environment
  if (isBuild) {
    // rollup-plugin-gzip
    vitePlugins.push(
      configCompressPlugin(
        VITE_BUILD_COMPRESS,
        VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
      ),
    );
  }

  return vitePlugins;
}
