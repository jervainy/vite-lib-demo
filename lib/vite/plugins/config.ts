import type { PluginOption } from "vite";
import { writeFileSync, mkdirs, readFileSync } from "fs-extra";
import pic from "picocolors";
import { resolve } from "path";
import dotenv from "dotenv";
import {
  GLOB_CONFIG_FILE_NAME,
  OUTPUT_DIR,
  APP_NAME,
} from "../config/constants";
import dayjs from "dayjs";

const { cyan, red, gray, green } = pic;

interface Options {
  configName: string;
  config: any;
  configFileName?: string;
}

function getAppConfigFileName(env: Record<string, any>) {
  return `__PRODUCTION__${env.VITE_GLOB_APP_SHORT_NAME || "__APP"}__CONF__`
    .toUpperCase()
    .replace(/\s/g, "");
}

/**
 * 获取当前环境下生效的配置文件名
 */
function getConfFiles() {
  const script = process.env.npm_lifecycle_script;
  const reg = new RegExp("--mode ([a-z_\\d]+)");
  const result = reg.exec(script as string) as any;

  if (result) {
    const mode = result[1] as string;
    return [".env", `.env.${mode}`];
  }

  return [".env", ".env.production"];
}

function getEnvConfig(match = "VITE_GLOB_", confFiles = getConfFiles()) {
  let envConfig: Record<string, string> = {};

  confFiles.forEach((item) => {
    try {
      const env = dotenv.parse(readFileSync(resolve(process.cwd(), item)));
      envConfig = { ...envConfig, ...env };
    } catch (e) {
      console.error(`Error in parsing ${item}`, e);
    }
  });

  const reg = new RegExp(`^(${match})`);

  Object.keys(envConfig).forEach((key) => {
    if (!reg.test(key)) {
      Reflect.deleteProperty(envConfig, key);
    }
  });

  return envConfig;
}

function getPackageInfo() {
  const env = process.env;
  const pkg: string[] = [
    "########## application-package-start ##########",
    `build_time: ${dayjs().format("YYYY-MM-DD_HH:mm:ss")}`,
    `name: ${env["npm_package_name"]}`,
    `version: ${env["npm_package_version"]}`,
  ];

  Object.keys(env).forEach((key: string) => {
    if (key.startsWith("npm_package_dependencies")) {
      const _key = key
        .replace("npm_package_dependencies_", "")
        .replace("npm_package_dependencies_", "");
      pkg.push(`${_key}: ${env[key]}`);
    }
  });

  pkg.push("########## application-package-end ##########");

  return pkg.map((str) => `console.log('#${str}');`).join("");
}

function createConfig(params: Options) {
  const { configName, config, configFileName } = params;
  try {
    const windowConf = `window.${configName}`;

    // Ensure that the variable will not be modified
    const configStr = `${windowConf}=${JSON.stringify(config)};
    Object.freeze(${windowConf});
    Object.defineProperty(window, "${configName}", {
      configurable: false,
      writable: false,
    });
    ${getPackageInfo()}
    `.replace(/\s/g, "");
    mkdirs(resolve(process.cwd(), OUTPUT_DIR));
    writeFileSync(
      resolve(process.cwd(), `${OUTPUT_DIR}/${configFileName}`),
      configStr,
    );

    console.log(
      cyan(`✨ [${APP_NAME}]`) + ` - configuration file is build successfully:`,
    );
    console.log(gray(OUTPUT_DIR + "/" + green(configFileName)) + "\n");
  } catch (error) {
    console.log(
      red("configuration file configuration file failed to package:\n" + error),
    );
  }
}

export function runBuildConfig() {
  const config = getEnvConfig();
  const configFileName = getAppConfigFileName(config);
  createConfig({
    config,
    configName: configFileName,
    configFileName: GLOB_CONFIG_FILE_NAME,
  });
}

export function createConfigPlugin(): PluginOption {
  return {
    name: "generate-config",
    closeBundle() {
      try {
        const argvList = process.argv.splice(2);
        // Generate configuration file
        if (!argvList.includes("disabled-config")) {
          runBuildConfig();
        }

        console.log(`✨ ${cyan(`[${APP_NAME}]`)} - build successfully!`);
      } catch (error) {
        console.log(red("vite build error:\n" + error));
        process.exit(1);
      }
    },
  };
}
