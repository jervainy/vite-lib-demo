import Mkcert from "vite-plugin-mkcert";
import type { PluginOption } from "vite";
import type { ViteEnv } from "../utils";

export function configHttpsPlugin(env: ViteEnv) {
  const { VITE_USE_HTTPS } = env;

  const plugins: PluginOption[] = [];

  if (VITE_USE_HTTPS) {
    plugins.push(Mkcert());
  }

  return plugins;
}
