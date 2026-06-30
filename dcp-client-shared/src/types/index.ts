export * from "./config";
export * from "./global";
export * from "./menu";
export * from "./router";
export * from "./service";
export * from "./setting";
export * from "./store";

export type AnyFunction<T> = (...args: any[]) => T;
export type Nullable<T> = T | null;
export type Recordable<T = any> = Record<string, T>;
export type TimeoutHandle = ReturnType<typeof setTimeout>;
export type IntervalHandle = ReturnType<typeof setInterval>;
export type DeepPartital<T> = {
  [P in keyof T]?: DeepPartital<T[P]>;
};
export type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;
