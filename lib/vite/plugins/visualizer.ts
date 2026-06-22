import type { PluginOption } from "vite";
import visualizer from "rollup-plugin-visualizer";

export function configVisualizerConfig(): PluginOption | null {
  if (process.env.PEPORT === "true") {
    return visualizer({
      filename: "./node_modules/.cache/visualizer/stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
    });
  }
  return null;
}
