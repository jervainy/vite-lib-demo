import type { PluginOption } from "vite";

export async function configVisualizerConfig(): Promise<PluginOption | null> {
  if (process.env.PEPORT === "true") {
    try {
      const visualizer = await import("rollup-plugin-visualizer");
      return visualizer.default({
        filename: "./node_modules/.cache/visualizer/stats.html",
        open: true,
        gzipSize: true,
        brotliSize: true,
      });
    } catch {
      return null;
    }
  }
  return null;
}
