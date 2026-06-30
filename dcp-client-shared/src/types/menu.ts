import type { RouteMeta } from "vue-router";
import { MenuModeEnum, RoleEnum } from "@/constants";
import { type JSX } from "vue/jsx-runtime";

export interface MenuTag {
  type?: "primary" | "error" | "warn" | "success";
  content?: string;
  dot?: boolean;
}

export interface Menu {
  name: string;
  icon?: string;
  path: string;
  paramPath?: string;
  disabled?: boolean;
  children?: Menu[];
  orderNo?: number;
  roles?: RoleEnum[];
  meta?: Partial<RouteMeta>;
  tag?: MenuTag;
  hideMenu?: boolean;
  label?: Node | JSX.Element | string;
  key?: string | number | Symbol;
}

export interface MenuModule {
  orderNo?: number;
  menu: Menu;
}

export interface BeforeMiniState {
  menuCollapsed?: boolean;
  menuSplit?: boolean;
  menuMode?: MenuModeEnum;
}

export interface MicroApp {
  path: string;
  name: string;
  url: string;
  baseroute: string;
  defaultPage: string;
  data: Object;
  extInfo: string;
  sandboxMode: string;
  config: {
    isUsingIframe: boolean;
    keepAlive: boolean;
    disableMemoryRouter: boolean;
    disablePatchRequest: boolean;
    destroy: boolean;
  };
}
