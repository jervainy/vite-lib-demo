import { resolve } from "node:path";
import { type UserConfig } from "vite";

export interface DefineOptions {
  overrides?: UserConfig;
  options?: {
    enableDts: boolean;
  };
}

function _resolve(dir: string) {
  return resolve(process.cwd(), dir);
}

export const commonConfig: (mode: string) => UserConfig = (mode) => ({
  resolve: {
    alias: {
      "@": _resolve("src"),
      "#": _resolve("types"),
    },
    extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  esbuild: {
    drop: mode === "production" ? ["console", "debugger"] : [],
  },
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1500,
    // rolldownOptions may be passed via overrides if needed
  },
  plugins: [],
});
