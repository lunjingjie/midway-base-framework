import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { PasswordUtil } from '../utils/password.util';
import { JwtUtil } from '../utils/jwt.util';
import { BusinessError } from '../error/base.error';
import { ResponseCode } from '../constants/response.constants';

@Provide()
export class AuthService {
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>;

  @Inject()
  passwordUtil: PasswordUtil;

  @Inject()
  jwtUtil: JwtUtil;

  // 用户登录
  async login(username: string, password: string) {
    // 查找用户
    const user = await this.userModel.findOne({ where: { username } });
    if (!user) {
      throw new BusinessError('用户名或密码错误', ResponseCode.UNAUTHORIZED);
    }

    // 检查用户状态
    if (user.status !== 1) {
      throw new BusinessError('用户已被禁用', ResponseCode.FORBIDDEN);
    }

    // 验证密码
    const isPasswordValid = await this.passwordUtil.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BusinessError('用户名或密码错误', ResponseCode.UNAUTHORIZED);
    }

    // 生成token
    const token = this.jwtUtil.generateToken({
      userId: user.id,
      username: user.username,
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        realName: user.realName,
        email: user.email,
        phone: user.phone,
        roleIds: user.roleIds,
      },
    };
  }

  // 获取当前用户信息
  async getCurrentUser(userId: number) {
    const user = await this.userModel.findOne({ where: { id: userId } });
    if (!user) {
      throw new BusinessError('用户不存在', ResponseCode.SUCCESS);
    }

    return {
      id: user.id,
      username: user.username,
      realName: user.realName,
      email: user.email,
      phone: user.phone,
      roleIds: user.roleIds,
    };
  }
}
