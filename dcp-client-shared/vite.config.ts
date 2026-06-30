import { definePackageConfig } from "dcp-toolkit";

export default definePackageConfig({
  options: {
    entry: {
      index: "src/index.ts",
      "constants/index": "src/constants/index.ts",
      "types/index": "src/types/index.ts",
    },
  },
});
