/**
 * @description 响应码
 * @author lunjingjie
 * @date 2025-07-02
 */
export enum ResponseCode {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

/**
 * @description 响应消息
 * @author lunjingjie
 * @date 2025-07-02
 */
export class ResponseMessage {
  static readonly SUCCESS = {
    zh: '操作成功',
    en: 'Operation successful',
  };

  static readonly BAD_REQUEST = {
    zh: '请求参数错误',
    en: 'Invalid request parameters',
  };

  static readonly INTERNAL_ERROR = {
    zh: '服务器内部错误',
    en: 'Internal server error',
  };
}
