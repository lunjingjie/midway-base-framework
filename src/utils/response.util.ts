import { BaseResponse } from '../interface';
import { ResponseCode, ResponseMessage } from '../constants/response.constants';

/**
 * @description 响应工具类
 * @author lunjingjie
 * @date 2025-07-02
 */
export class ResponseUtil {
  static success<T>(
    data: T,
    message = ResponseMessage.SUCCESS
  ): BaseResponse<T> {
    return {
      code: ResponseCode.SUCCESS,
      data,
      message: message.zh, // 或者根据请求头的语言设置来选择语言
    };
  }

  static error(
    code: number = ResponseCode.INTERNAL_ERROR,
    message = ResponseMessage.INTERNAL_ERROR,
    data: any = null
  ): BaseResponse<any> {
    return {
      code,
      data,
      message: message.zh, // 或者根据请求头的语言设置来选择语言
    };
  }
}
