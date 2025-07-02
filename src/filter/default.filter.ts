import { Catch } from '@midwayjs/core';
import { ResponseUtil } from '../utils/response.util';
import { BaseError } from '../error/base.error';
import { Context } from '@midwayjs/koa';

/**
 * @description 默认错误过滤器，拦截BaseError
 * @author lunjingjie
 * @date 2025-07-02
 */
@Catch()
export class DefaultErrorFilter {
  async catch(err: Error, ctx: Context) {
    if (err instanceof BaseError) {
      ctx.status = err.code;
      return ResponseUtil.error(err.code, {
        zh: err.message,
        en: err.message, // 可以根据需要提供英文信息
      });
    }

    // 未知错误统一处理
    return ResponseUtil.error();
  }
}
