import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const pkg = JSON.parse(
  readFileSync(resolve(process.cwd(), "package.json"), "utf-8"),
);

const { dependencies = {}, devDependencies = {}, peerDependencies = {} } = pkg;

export default defineConfig({
  publicDir: false,
  build: {
    lib: {
      entry: {
        "vite/index": "./src/vite/index.ts",
        // "tsconfig/base": "./src/tsconfig/base.json",
      },
      formats: ["es"],
    },
    rolldownOptions: {
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
      },
      external: [
        ...Object.keys(dependencies),
        ...Object.keys(devDependencies),
        ...Object.keys(peerDependencies),
        /^node:/,
      ],
    },
  },
});
