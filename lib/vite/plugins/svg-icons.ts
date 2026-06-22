import { createSvgIconsPlugin } from "vite-plugin-svg-icons-ng";
import { resolve } from "path";

export function configSvgIconsPlugin(isBuild: boolean) {
  const svgIconsPlugin = createSvgIconsPlugin({
    iconDirs: [resolve(process.cwd(), "src/assets/icons")],
    svgoOptions: isBuild,
  });
  return svgIconsPlugin;
}
