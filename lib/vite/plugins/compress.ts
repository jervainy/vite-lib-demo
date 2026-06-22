import type { PluginOption } from "vite";
import { compression, type Algorithm } from "vite-plugin-compression2";

export function configCompressPlugin(
  compress: string,
  deleteOriginFile = false,
): PluginOption[] {
  const compressList = compress.split(",");

  const algorithms: Algorithm[] = [];

  if (compressList.includes("gzip")) {
    algorithms.push("gzip");
  }

  if (compressList.includes("brotli")) {
    algorithms.push("brotliCompress");
  }

  if (algorithms.length === 0) {
    return [];
  }

  return [
    compression({
      algorithms,
      deleteOriginalAssets: deleteOriginFile,
    }),
  ];
}
