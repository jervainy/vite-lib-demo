import type { VNodeChild, PropType as VuePropType } from "vue";
import type { JSX } from "vue/jsx-runtime";
import type { RouteRecordItem as IRouteRecordItem } from "./router";

declare global {
  type RouteRecordItem = IRouteRecordItem;

  type PropType<T> = VuePropType<T>;
  type VueNode = VNodeChild | JSX.Element;

  type AnyFunction<T> = (...args: any[]) => T;
  type PartialReturnType<T extends (...args: unknown[]) => unknown> = Partial<
    ReturnType<T>
  >;
  type Nullable<T> = T | null;
  type Recordable<T = any> = Record<string, T>;
  type TimeoutHandle = ReturnType<typeof setTimeout>;
  type IntervalHandle = ReturnType<typeof setInterval>;
  type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
  };

  interface Fn<T = any, R = T> {
    (...arg: T[]): R;
  }

  interface PromiseFn<T = any, R = T> {
    (...arg: T[]): Promise<R>;
  }

  type RefType<T> = T | null;

  type LabelValueOptions = {
    label: string;
    value: any;
    [key: string]: string | number | boolean;
  }[];

  type EmitType = (event: string, ...args: any[]) => void;

  type TargetContext = "_self" | "_blank";

  interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
    $el: T;
  }

  type ComponentRef<T extends HTMLElement = HTMLDivElement> =
    ComponentElRef<T> | null;

  type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;
}
