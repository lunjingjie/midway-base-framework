import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { BaseService } from './base.service';
import { PasswordUtil } from '../utils/password.util';
import { BusinessError } from '../error/base.error';
import { ResponseCode } from '../constants/response.constants';
import { UserRoleService } from './user-role.service';
import { RoleMenuService } from './role-menu.service';

/**
 * @description 用户服务类
 * @author AI Assistant
 * @date 2025-07-02
 */
@Provide()
export class UserService extends BaseService<UserEntity> {
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>;

  @Inject()
  passwordUtil: PasswordUtil;

  @Inject()
  userRoleService: UserRoleService;

  @Inject()
  roleMenuService: RoleMenuService;

  protected getRepository(): Repository<UserEntity> {
    if (!this.userModel) {
      throw new BusinessError('用户模型未正确初始化', ResponseCode.INTERNAL_ERROR);
    }
    return this.userModel;
  }

  /**
   * 创建用户（重写基类方法，增加密码加密逻辑）
   * @param user 用户对象
   * @param roleIds 角色ID数组
   * @returns 创建后的用户
   */
  async create(user: Partial<UserEntity>, roleIds?: number[]): Promise<UserEntity> {
    try {
      // 检查用户名是否已存在
      const repo = this.getRepository();
      const existingUser = await repo.findOne({
        where: { username: user.username },
      });

      if (existingUser) {
        throw new BusinessError('用户名已存在', ResponseCode.BAD_REQUEST);
      }

      // 加密密码
      if (user.password) {
        user.password = await this.passwordUtil.hash(user.password);
      }

      // 创建用户
      const newUser = await super.create(user);

      // 分配角色
      if (roleIds && roleIds.length > 0) {
        await this.userRoleService.assignRolesToUser(newUser.id, roleIds);
      }

      return newUser;
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`创建用户失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 更新用户（重写基类方法，增加密码加密逻辑）
   * @param id 用户ID
   * @param user 用户对象
   * @param roleIds 角色ID数组
   * @returns 更新后的用户
   */
  async update(
    id: number | string,
    user: Partial<UserEntity>,
    roleIds?: number[],
  ): Promise<UserEntity> {
    try {
      // 如果更新包含密码，则加密密码
      if (user.password) {
        user.password = await this.passwordUtil.hash(user.password);
      }

      // 更新用户
      const updatedUser = await super.update(id, user);

      // 更新角色
      if (roleIds) {
        await this.userRoleService.assignRolesToUser(Number(id), roleIds);
      }

      return updatedUser;
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`更新用户失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 根据用户名查找用户
   * @param username 用户名
   * @returns 用户对象
   */
  async findByUsername(username: string): Promise<UserEntity> {
    try {
      const repo = this.getRepository();
      const user = await repo.findOne({
        where: { username },
      });

      if (!user) {
        throw new BusinessError('用户不存在', ResponseCode.NOT_FOUND);
      }

      return user;
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`查询用户失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 获取用户的角色ID列表
   * @param userId 用户ID
   * @returns 角色ID数组
   */
  async getUserRoleIds(userId: number): Promise<number[]> {
    try {
      return await this.userRoleService.getRoleIdsByUserId(userId);
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`获取用户角色失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 获取用户的菜单ID列表
   * @param userId 用户ID
   * @returns 菜单ID数组
   */
  async getUserMenuIds(userId: number): Promise<number[]> {
    try {
      // 获取用户的角色ID
      const roleIds = await this.getUserRoleIds(userId);
      if (roleIds.length === 0) {
        return [];
      }

      // 获取这些角色的菜单ID
      return await this.roleMenuService.getMenuIdsByRoleIds(roleIds);
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`获取用户菜单失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 修改用户状态
   * @param id 用户ID
   * @param status 状态值
   * @returns 更新后的用户
   */
  async changeStatus(id: number, status: number): Promise<UserEntity> {
    try {
      return await this.update(id, { status } as any);
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`修改用户状态失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }
}
