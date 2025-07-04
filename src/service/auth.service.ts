import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { PasswordUtil } from '../utils/password.util';
import { JwtUtil } from '../utils/jwt.util';
import { BusinessError } from '../error/base.error';
import { ResponseCode } from '../constants/response.constants';
import { UserRoleService } from './user-role.service';
import { RoleMenuService } from './role-menu.service';
import { UserService } from './user.service';

@Provide()
export class AuthService {
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>;

  @Inject()
  passwordUtil: PasswordUtil;

  @Inject()
  jwtUtil: JwtUtil;

  @Inject()
  userRoleService: UserRoleService;

  @Inject()
  roleMenuService: RoleMenuService;

  @Inject()
  userService: UserService;

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

    // 获取用户角色
    const roleIds = await this.userRoleService.getRoleIdsByUserId(user.id);

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
        roleIds: roleIds,
      },
    };
  }

  // 用户注册
  async register(userData: {
    username: string;
    password: string;
    confirmPassword: string;
    realName?: string;
    email?: string;
    phone?: string;
  }) {
    // 验证两次密码是否一致
    if (userData.password !== userData.confirmPassword) {
      throw new BusinessError('两次输入的密码不一致', ResponseCode.BAD_REQUEST);
    }

    try {
      // 创建用户
      const user = await this.userService.create({
        username: userData.username,
        password: userData.password,
        realName: userData.realName,
        email: userData.email,
        phone: userData.phone,
        status: 1, // 默认启用
      });

      // 为新注册用户分配默认角色（如普通用户角色）
      // 假设ID为2的角色是普通用户角色
      const defaultRoleId = 2;
      await this.userRoleService.assignRolesToUser(user.id, [defaultRoleId]);

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
          roleIds: [defaultRoleId],
        },
      };
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`注册失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  // 获取当前用户信息
  async getCurrentUser(userId: number) {
    const user = await this.userModel.findOne({ where: { id: userId } });
    if (!user) {
      throw new BusinessError('用户不存在', ResponseCode.SUCCESS);
    }

    // 获取用户角色
    const roleIds = await this.userRoleService.getRoleIdsByUserId(user.id);

    // 获取用户菜单
    const menuIds = await this.roleMenuService.getMenuIdsByRoleIds(roleIds);

    return {
      id: user.id,
      username: user.username,
      realName: user.realName,
      email: user.email,
      phone: user.phone,
      roleIds: roleIds,
      menuIds: menuIds,
    };
  }
}
