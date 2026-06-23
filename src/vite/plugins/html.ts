import type { PluginOption } from "vite";
import { readPackageJSON } from "pkg-types";
import { GLOB_CONFIG_FILE_NAME } from "../config/constants";
import type { ViteEnv } from "../utils";

export async function configHtmlPlugin(
  root: string,
  env: ViteEnv,
  isBuild: boolean,
): Promise<PluginOption> {
  const { VITE_GLOB_APP_TITLE, VITE_PUBLIC_PATH } = env;

  const basePath = VITE_PUBLIC_PATH.endsWith("/")
    ? VITE_PUBLIC_PATH
    : `${VITE_PUBLIC_PATH}/`;

  const { version } = await readPackageJSON(root);
  const appConfigSrc = `${basePath || "/"}${GLOB_CONFIG_FILE_NAME}?v=${version}-${new Date().getTime()}`;

  return {
    name: "html-config",
    transformIndexHtml(html) {
      // 1. 替换 EJS 模板变量
      let result = html.replace(/<%= title %>/g, VITE_GLOB_APP_TITLE);

      // 2. 生产环境注入 _app.config.js
      if (isBuild) {
        result = result.replace(
          "</body>",
          `<script src="${appConfigSrc}"></script></body>`,
        );
      }

      return result;
    },
  };
}
