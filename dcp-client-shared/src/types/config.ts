import {
  CacheTypeEnum,
  ContentLayoutEnum,
  MenuModeEnum,
  MixSidebarTriggerEnum,
  SettingButtonPositionEnum,
  ThemeEnum,
  TriggerEnum,
  RouterTransitionEnum,
} from "@/constants";

export type LocaleType = "zh_CN" | "en";

export interface LocaleConfig {
  locale: LocaleType;
  fallback: LocaleType;
  availableLocales: LocaleType[];
}

export interface GlobConfig {
  title: string;
  apiUrl: string;
  apiTimeout: string;
  shortName: string;
  baseUrl: string;
  downloadMimeType: string;
}

export interface GlobEnvConfig {
  VITE_GLOB_APP_TITLE: string;
  VITE_GLOB_API_URL: string;
  VITE_GLOB_API_TIMEOUT: string;
  VITE_GLOB_APP_SHORT_NAME: string;
  VITE_GLOB_BASE_URL: string;
  VITE_GLOB_DOWNLOAD_MIMETYPE: string;
}

export interface DefineAppConfigOptions {
  theme: ThemeEnum;
  showThemeModeToggle: boolean;
  openKeepAlive: boolean;
  useOpenBackTop: boolean;
  canEmbedIFramePage: boolean;
  closeMessageOnSwitch: boolean;
  closeMixSidebarOnChange: boolean;
  removeAllHttpPending: boolean;
  permissionCacheType: CacheTypeEnum;
  settingButtonPosition: SettingButtonPositionEnum;
  openSettingDrawer: boolean;
  grayMode: boolean;
  colorWeak: boolean;
  sidebar: SidebarConfigOptions;
  menu: MenuConfigOptions;
  header: HeaderConfigOptions;
  logo: LogoConfigOptions;
  tabTar: TabTarConfigOptions;
  content: ContentConfigOptions;
  footer: FooterConfigOptions;
  transition: TransitionConfigOptions;
}

export interface SidebarConfigOptions {
  show: boolean;
  visible: boolean;
  fixed: boolean;
  collapsed: boolean;
  width: number;
  trigger: TriggerEnum;
  readonly mixSidebarWidth: number;
  readonly collapsedWidth: number;
}

export interface MenuConfigOptions {
  show: boolean;
  canDrag: boolean;
  split: boolean;
  mode: MenuModeEnum;
  accordion: boolean;
  collapsedShowTitle: boolean;
  mixSideTrigger: MixSidebarTriggerEnum;
  mixSideFixed: boolean;
  topMenuAlign: "start" | "center" | "end";
  subMenuWidth: number;
  dropdownPlacement:
    | "top-start"
    | "top"
    | "top-end"
    | "right-start"
    | "right"
    | "right-end"
    | "bottom-start"
    | "bottom"
    | "bottom-end"
    | "left-start"
    | "left"
    | "left-end";
}

export interface HeaderConfigOptions {
  show: boolean;
  visible: boolean;
  fixed: boolean;
  showFullScreen: boolean;
  showDoc: boolean;
  showNotice: boolean;
  showSearch: boolean;
  showLocalePicker: boolean;
  showSetting: boolean;
  readonly height: number;
  showBreadCrumb: boolean;
  showBreadCrumbIcon: boolean;
}

export interface LogoConfigOptions {
  show: boolean;
  visible: boolean;
  showTitle: boolean;
}

export interface TabTarConfigOptions {
  show: boolean;
  visbile: boolean;
  cache: boolean;
  readonly height: number;
}

export interface ContentConfigOptions {
  fullScreen: boolean;
  mode: ContentLayoutEnum;
}

export interface FooterConfigOptions {
  show: boolean;
  visible: boolean;
  readonly height: number;
}

export interface TransitionConfigOptions {
  enable: boolean;
  basicTransition: RouterTransitionEnum;
  openPageLoading: boolean;
  openNProgress: boolean;
}

export interface FooterLinkOptions {
  label?: string;
  icon?: string;
  target?: "_self" | "_blank";
  url: string;
}

export interface DefineSiteGeneralOptions {
  logo: string;
  title: string;
  copyright: string;
  links: FooterLinkOptions[];
  avatar: string;
  userName: string;
}
