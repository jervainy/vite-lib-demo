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

export interface MenuSetting {
  fixed: boolean;
  collapsed: boolean;
  canDrag: boolean;
  show: boolean;
  split: boolean;
  menuWidth: number;
  mode: MenuModeEnum;
  theme: ThemeEnum;
  topMenuAlign: "start" | "center" | "end";
  trigger: TriggerEnum;
  accordion: boolean;
  closeMixSidebarOnChange: boolean;
  collapsedShowTitle: boolean;
  mixSideTrigger: MixSidebarTriggerEnum;
  mixSideFixed: boolean;
  readonly width: number;
  readonly mixSidebarWidth: number;
  readonly collapsedWidth: number;
}

export interface MultiTabsSetting {
  show: boolean;
  readonly height: number;
}

export interface HeaderSetting {
  fixed: boolean;
  show: boolean;
  theme: ThemeEnum;
  showFullScreen: boolean;
  showDoc: boolean;
  showNotice: boolean;
  showSearch: boolean;
  showLocalePicker: boolean;
  readonly height: number;
}

export interface TransitionSetting {
  enable: boolean;
  basicTransition: RouterTransitionEnum;
  openPageLoading: boolean;
  openNProgress: boolean;
}

export interface SporadicSetting {
  openNProgress: boolean;
  openKeepAlive: boolean;
  showBreadCrumb: boolean;
  showBreadCrumbIcon: boolean;
  useOpenBackTop: boolean;
  canEmbedIFramePage: boolean;
  closeMessageOnSwitch: boolean;
  removeAllHttpPending: boolean;
  permissionCacheType: CacheTypeEnum;
  showSettingButton: boolean;
  showDarkModeToggle: boolean;
  settingButtonPosition: SettingButtonPositionEnum;
  showSettingDrawer: boolean;
  grayMode: boolean;
  colorWeak: boolean;
  fullContent: boolean;
  contentMode: ContentLayoutEnum;
  showLogo: boolean;
  showFooter: boolean;
  readonly footerHeight: number;
}

export interface ProjectConfig extends SporadicSetting {
  headerSetting: HeaderSetting;
  menuSetting: MenuSetting;
  multiTabsSetting: MultiTabsSetting;
  transitionSetting: TransitionSetting;
}
