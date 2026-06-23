import { createSvgIconsPlugin } from "vite-plugin-svg-icons-ng";
import { resolve } from "path";

export function configSvgIconsPlugin(_isBuild: boolean) {
  const svgIconsPlugin = createSvgIconsPlugin({
    iconDirs: [resolve(process.cwd(), "src/assets/icons")],
  });
  return svgIconsPlugin;
}
