import { Inject, Middleware } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import { JwtUtil } from '../utils/jwt.util';
import { BusinessError } from '../error/base.error';
import { ResponseCode } from '../constants/response.constants';

@Middleware()
export class JwtMiddleware {
  @Inject()
  jwtUtil: JwtUtil;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 从请求头获取token
      const token = ctx.get('Authorization');
      if (!token) {
        throw new BusinessError('未授权', ResponseCode.UNAUTHORIZED);
      }

      // 验证token
      const decoded = this.jwtUtil.verifyToken(token);
      if (!decoded) {
        throw new BusinessError('无效的token', ResponseCode.UNAUTHORIZED);
      }

      // 将用户信息存储在上下文中
      ctx.user = decoded;

      return next();
    };
  }

  // 装饰器工厂，用于控制器方法上
  static(): any {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;
      descriptor.value = async function (...args: any[]) {
        // 这里不需要做任何事情，中间件会自动应用
        return originalMethod.apply(this, args);
      };
      return descriptor;
    };
  }
}
