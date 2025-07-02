import { Catch } from '@midwayjs/core';
import { MidwayValidationError } from '@midwayjs/validate';
import { ResponseUtil } from '../utils/response.util';
import { ResponseCode } from '../constants/response.constants';
import { Context } from '@midwayjs/koa';

/**
 * @description 参数验证错误过滤器
 * @author lunjingjie
 * @date 2025-07-02
 */
@Catch(MidwayValidationError)
export class ValidateErrorFilter {
  async catch(err: MidwayValidationError, ctx: Context) {
    ctx.status = ResponseCode.BAD_REQUEST;
    return ResponseUtil.error(ResponseCode.BAD_REQUEST, {
      zh: `${err.message}`,
      en: `Invalid Parameters: ${err.message}`,
    });
  }
}
