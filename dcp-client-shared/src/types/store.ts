import { UserIdentityTypeEnum } from "@/constants";
import { type Nullable } from "./index";

export interface TenantInfo {
  tenantId: string;
  tenantName: string;
}

export interface AuthInfo {
  authorityCode: string;
  authorityName: string;
  authorityType: string;
  domainId: number;
  menuId: number;
  menuUrl: string;
  menuCode: string;
  otherAuthList: AuthInfo[];
  viewableList: AuthInfo[];
}

export interface UserInfo {
  id: string | number;
  isSuperAdmin: boolean;
  isTenantAdmin: boolean;
  personCode?: string;
  personName?: string;
  userName?: string;
  email?: string;
  gender?: number;
  phone?: string;
  position?: string;
  tenantId?: string;
  tenantName?: string;
  tenantDisplayName?: string;
  tenantDesc?: string;
  avatar: string;
  domainCode?: string;
  orgArea?: string;
  orgCode?: string;
  orgName?: string;
  orgDesc?: string;
  orgId?: number;
  orgLogo?: string;
  otherAuthList: AuthInfo[];
  viewableList: AuthInfo[];
  tenantUserLoginBo?: Nullable<UserInfo>;
  accessToken?: string | undefined;
}

export interface UserState {
  userInfo: Nullable<UserInfo>;
  userIdentityType: null | UserIdentityTypeEnum;
  accessToken: string | undefined;
  projectAuthList: AuthInfo[];
  isDefaultPassword: boolean;
  alluserViewableList: AuthInfo[];
  allUserOtherAuthList: AuthInfo[];
}

export interface LoginParams {
  captcha: {
    code: string;
    uuid: string;
  };
  loginMode: string;
  password: string;
  accountName: string;
  tenantId: string;
}

export interface LoginResultModel {
  loginId: string | number;
  accessToken: string;
  defaultPassword: boolean;
}
