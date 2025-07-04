import { Inject, Middleware, MidwayWebRouterService } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import { JwtUtil } from '../utils/jwt.util';
import { BusinessError } from '../error/base.error';
import { ResponseCode } from '../constants/response.constants';

@Middleware()
export class JwtMiddleware {
  @Inject()
  jwtUtil: JwtUtil;

  @Inject()
  webRouterService: MidwayWebRouterService;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 获取当前请求的路由信息
      const routeInfo = await this.webRouterService.getMatchedRouterInfo(ctx.path, ctx.method);

      // 如果找不到路由信息，继续执行验证
      if (routeInfo) {
        const { controllerClz, method } = routeInfo;

        // 检查控制器类上是否有SkipAuth注解
        const controllerSkipAuth = Reflect.getMetadata('skipAuth', controllerClz);
        if (controllerSkipAuth) {
          return next();
        }

        // 检查方法上是否有SkipAuth注解
        const methodSkipAuth = Reflect.getMetadata('skipAuth', controllerClz.prototype, method);
        if (methodSkipAuth) {
          return next();
        }
      }

      // 从请求头获取token
      const authHeader = ctx.get('Authorization');
      if (!authHeader) {
        throw new BusinessError('未授权', ResponseCode.UNAUTHORIZED);
      }

      // 处理Bearer token格式
      const parts = authHeader.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        throw new BusinessError('无效的token格式', ResponseCode.UNAUTHORIZED);
      }

      const token = parts[1];

      // 验证token
      try {
        const decoded = this.jwtUtil.verifyToken(token);
        if (!decoded) {
          throw new BusinessError('无效的token', ResponseCode.UNAUTHORIZED);
        }

        // 将用户信息存储在上下文中
        ctx.user = decoded;
      } catch (error) {
        if (error instanceof BusinessError) {
          throw error;
        }
        throw new BusinessError('token验证失败', ResponseCode.UNAUTHORIZED);
      }

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
