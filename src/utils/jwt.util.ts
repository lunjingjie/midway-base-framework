import { Config, Provide, Scope, ScopeEnum } from '@midwayjs/core';

import * as jwt from 'jsonwebtoken';
import { BaseError } from '../error/base.error';

/**
 * @description JWT工具类
 * @author lunjingjie
 * @date 2025-07-02
 */
@Provide()
@Scope(ScopeEnum.Request, { allowDowngrade: true })
export class JwtUtil {
  @Config('jwt')
  jwtConfig;

  generateToken(payload: any): string {
    return jwt.sign(payload, this.jwtConfig.secret, {
      expiresIn: this.jwtConfig.expiresIn,
    });
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtConfig.secret);
    } catch (error) {
      throw new BaseError('无效的token');
    }
  }
}
