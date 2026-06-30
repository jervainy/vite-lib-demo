export type ErrorMessageMode =
  | "none"
  | "modal"
  | "message"
  | "notification"
  | undefined;

export interface RequestOptions {
  joinParamsToUrl?: boolean;
  formatDate?: boolean;
  isTransformResponse?: boolean;
  isReturnNativeResponse?: boolean;
  apiUrl?: string | (() => string);
  errorMessageMode?: ErrorMessageMode;
  joinTime?: boolean;
  ignoreCancelToken?: boolean;
  withToken?: boolean;
  downloadMimeType?: string[];
}

export interface RequestResult<T = any> {
  code: number;
  type: "application/octet-stream";
  message: string;
  result: T;
}
