import { chunkSplitPlugin } from "vite-plugin-chunk-split";

export function configChunkSplitPlugin() {
  return chunkSplitPlugin({
    strategy: "default",
    useEntryName: true,
    customSplitting: {
      "vue-vendor": ["vue", "vue-router", "pinia"],
      mockjs: ["mockjs"],
      "your-shared-lib": [
        // add shared library packages here, e.g.:
        // "my-shared-apis",
        // "my-shared-hooks",
      ],
      "micro-app": [
        // add micro-frontend packages here, e.g.:
        // "@micro-zoe/micro-app",
      ],
    },
  });
}
