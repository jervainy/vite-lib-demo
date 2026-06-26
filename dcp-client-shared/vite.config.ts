import { definePackageConfig } from "dcp-toolkit";

export default definePackageConfig({
  options: {
    entry: {
      "constants/index": "src/constants/index.ts",
      "types/config": "src/types/config.ts",
    },
  },
});
