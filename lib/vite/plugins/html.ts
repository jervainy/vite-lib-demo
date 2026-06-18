import { readPackageJSON } from "pkg-types";
import { createHtmlPlugin } from "vite-plugin-html";
import { GLOB_CONFIG_FILE_NAME } from "../config/constants";
import type { ViteEnv } from "../utils";

export async function configHtmlPlugin(
  root: string,
  env: ViteEnv,
  isBuild: boolean,
) {
  const { VITE_GLOB_APP_TITLE, VITE_PUBLIC_PATH } = env;
  const { version } = await readPackageJSON(root);

  const path = VITE_PUBLIC_PATH.endsWith("/")
    ? VITE_PUBLIC_PATH
    : `${VITE_PUBLIC_PATH}/`;

  const getAppConfigSrc = () => {
    return `${path || "/"}${GLOB_CONFIG_FILE_NAME}?v=${version}-${new Date().getTime()}`;
  };

  const htmlPlugin = createHtmlPlugin({
    minify: isBuild,
    inject: {
      // Inject data into ejs template
      data: {
        title: VITE_GLOB_APP_TITLE,
      },
      // Embed the generated app.config.js file
      tags: isBuild
        ? [
            {
              tag: "script",
              attrs: {
                src: getAppConfigSrc(),
              },
            },
          ]
        : [],
    },
  });

  return htmlPlugin;
}
