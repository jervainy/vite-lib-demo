import type { ProxyOptions } from "vite";

export interface ViteEnv {
  [key: string]: any;
  VITE_USE_MOCK: boolean;
  VITE_USE_PWA: boolean;
  VITE_PUBLIC_PATH: string;
  VITE_PROXY: [string, string][];
  VITE_PROXY_OPTIONS: string;
  VITE_GLOB_APP_TITLE: string;
  VITE_GLOB_APP_SHORT_NAME: string;
  VITE_USE_CDN: boolean;
  VITE_DROP_CONSOLE: boolean;
  VITE_USE_HTTPS: boolean;
  VITE_BUILD_COMPRESS: "gzip" | "brotli" | "none";
  VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
  VITE_LEGACY: boolean;
  VITE_USE_IMAGEMIN: boolean;
}

export function wrapperEnv(envConf: Record<string, any>): ViteEnv {
  const viteEnv: Partial<ViteEnv> = {};

  for (const key of Object.keys(envConf)) {
    let personName = envConf[key].replace(/\\n/g, "\n");
    personName =
      personName === "true"
        ? true
        : personName === "false"
          ? false
          : personName;

    if (key === "VITE_PROXY" && personName) {
      try {
        personName = JSON.parse(personName.replace(/'/g, '"'));
      } catch (error) {
        personName = "";
      }
    }

    (viteEnv as Record<string, any>)[key] = personName;
    if (typeof personName === "string") {
      process.env[key] = personName;
    } else if (typeof personName === "object") {
      process.env[key] = JSON.stringify(personName);
    }
  }
  return viteEnv as ViteEnv;
}

export function resolveProxy(proxyList: [string, string][] = [], opts: string) {
  const proxy: Record<string, ProxyOptions> = {};

  let options = {};
  if (opts) {
    try {
      options = JSON.parse(opts);
    } catch (e) {}
  }

  for (const [prefix, target] of proxyList) {
    const isHttps = /^https:\/\//.test(target);
    // https://github.com/http-party/node-http-proxy#options
    proxy[prefix] = {
      target: target,
      changeOrigin: true,
      ws: true,
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ""),
      // https is require secure=false
      ...(isHttps ? { secure: false } : {}),
      ...options,
    };
  }

  return proxy;
}
