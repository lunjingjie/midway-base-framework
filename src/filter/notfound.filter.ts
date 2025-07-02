import { Catch, httpError, MidwayHttpError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ResponseUtil } from '../utils/response.util';
import { ResponseCode } from '../constants/response.constants';

/**
 * @description 404 错误过滤器
 * @author lunjingjie
 * @date 2025-07-02
 */
@Catch(httpError.NotFoundError)
export class NotFoundFilter {
  async catch(err: MidwayHttpError, ctx: Context) {
    ctx.status = ResponseCode.NOT_FOUND;
    return ResponseUtil.error(ResponseCode.NOT_FOUND, {
      zh: '请求的资源不存在',
      en: 'Resource not found',
    });
  }
}
