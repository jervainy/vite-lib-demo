export * from "./appEnum";
export * from "./breakpoint";
export * from "./cacheEnum";
export * from "./designSetting";
export * from "./menuEnum";
export * from "./microApp";
export * from "./multipleTabEnum";
export * from "./parameterEnum";
export * from "./router";
export * from "./sidebar";
export * from "./store";

export enum ResultEnum {
  SUCCESS = "1000",
  ERROR = "-1",
  TYPE = "success",

  Bad_Request = 400,
  Unahthorized = 401,
  Forbidden = 403,
  Not_Found = 404,

  Internal_Server_Error = 500,
  Not_Implemented = 501,
  Bad_Gateway = 502,
  Service_Unavailable = 503,
  Not_Account = 510,
}
