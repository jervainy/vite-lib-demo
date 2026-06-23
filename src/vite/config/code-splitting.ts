import type { UserConfig } from "vite";

/**
 * Vite 8 原生 code splitting 配置。
 *
 * 将旧版 vite-plugin-chunk-split 的 customSplitting 规则映射为
 * Vite 8 的 build.rolldownOptions.output.codeSplitting.groups API。
 *
 * 对照参照文件: lib/vite/plugins/chunk-split.ts
 *
 * 旧 (vite-plugin-chunk-split):
 *   customSplitting: { "chunk-name": ["pkg-a", "pkg-b"] }
 *
 * 新 (Vite 8 Rolldown):
 *   codeSplitting.groups: [{ name, test: RegExp, priority }]
 */
export function configCodeSplitting(): UserConfig {
  return {
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              // vue / vue-router / pinia → 核心框架，最高优先级
              {
                name: "vue-vendor",
                test: /node_modules[\\/](vue|vue-router|pinia)[\\/]/,
                priority: 50,
              },
              // mockjs
              {
                name: "mockjs",
                test: /node_modules[\\/]mockjs[\\/]/,
                priority: 40,
              },
              // @dcp-jssdk/core
              {
                name: "dcp-jssdk-core",
                test: /node_modules[\\/]@dcp-jssdk[\\/]core[\\/]/,
                priority: 40,
              },
              // @micro-zoe/micro-app
              {
                name: "micro-app",
                test: /node_modules[\\/]@micro-zoe[\\/]micro-app[\\/]/,
                priority: 40,
              },
              // @dcp-client-shared/* 所有子包 → 较低优先级，
              // 确保上方更具体的分组优先匹配
              {
                name: "dcp-client-shared",
                test: /node_modules[\\/]@dcp-client-shared[\\/]/,
                priority: 30,
              },
            ],
          },
        },
      },
    },
  };
}
