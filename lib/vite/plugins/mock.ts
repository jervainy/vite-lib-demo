import { vitePluginFakeServer } from "vite-plugin-fake-server";

export function configMockPlugin(isBuild: boolean) {
  return vitePluginFakeServer({
    include: "mock",
    infixName: "mock",
    enableDev: !isBuild,
    enableProd: isBuild,
  });
}
