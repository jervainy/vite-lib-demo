import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const pkg = JSON.parse(
  readFileSync(resolve(process.cwd(), "package.json"), "utf-8"),
);

const { dependencies = {}, devDependencies = {}, peerDependencies = {} } = pkg;

function getTsconfigPath(): Plugin {
  return {
    name: "tsconfig",
    closeBundle() {
      const fs = require("fs");
      const path = require("path");
      const source = path.resolve(__dirname, "./src/tsconfig");
      const target = path.resolve(__dirname, "dist/tsconfig");
      if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
      }
      const files = fs.readdirSync(source);
      files.forEach((file: string) => {
        const sourcePath = path.resolve(source, file);
        const targetPath = path.resolve(target, file);
        if (fs.statSync(sourcePath).isFile()) {
          fs.copyFileSync(sourcePath, targetPath);
        }
      });
    },
  };
}

export default defineConfig({
  publicDir: false,
  plugins: [getTsconfigPath()],
  build: {
    lib: {
      entry: {
        "vite/index": "./src/vite/index.ts",
        "lint/commitlint": "./src/lint/commitlint.js",
        "lint/cz-config": "./src/lint/cz-config.js",
        "lint/stylelint": "./src/lint/stylelint.js",
      },
      formats: ["es"],
    },
    rolldownOptions: {
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
      },
      external: (id: string) => {
        console.log("[external]", id);
        // 相对路径 → 保留打包
        if (id.startsWith(".")) return false;
        // @/ 别名 → 保留打包
        if (id.startsWith("@/")) return false;
        // 解析后的绝对路径: node_modules → external, 项目源码 → 保留
        if (id.startsWith("/") || /^[A-Z]:[\\/]/.test(id))
          return id.includes("node_modules");
        // 其余裸说明符 → external
        return true;
      },
    },
  },
});
