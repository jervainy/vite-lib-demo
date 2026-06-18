import { chunkSplitPlugin } from "vite-plugin-chunk-split";

export function configChunkSplitPlugin() {
  return chunkSplitPlugin({
    strategy: "default",
    useEntryName: true,
    customSplitting: {
      "vue-vendor": ["vue", "vue-router", "pinia"],
      mockjs: ["mockjs"],
      "dcp-client-shared": [
        "@dcp-client-shared/apis",
        "@dcp-client-shared/constants",
        "@dcp-client-shared/hooks",
      ],
      "micro-app": ["@micro-zoe/micro-app"],
    },
  });
}
