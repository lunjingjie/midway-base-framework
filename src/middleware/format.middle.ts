import { IMiddleware, Middleware } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import { ResponseUtil } from '../utils/response.util';

/**
 * @description 响应格式化中间件
 * @author lunjingjie
 * @date 2025-07-02
 */
@Middleware()
export class FormatMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const result = await next();
      // 如果控制器已经返回了完整的响应格式，则直接返回
      if (result && 'code' in result && 'data' in result && 'message' in result) {
        return result;
      }
      // 否则包装为标准响应格式
      return ResponseUtil.success(result);
    };
  }
}
