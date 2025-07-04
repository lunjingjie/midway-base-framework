import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { UserRoleEntity } from '../entity/user-role.entity';
import { BaseService } from './base.service';
import { BusinessError } from '../error/base.error';
import { ResponseCode } from '../constants/response.constants';

/**
 * @description 用户-角色关联服务
 * @author AI Assistant
 * @date 2025-07-02
 */
@Provide()
export class UserRoleService extends BaseService<UserRoleEntity> {
  @InjectEntityModel(UserRoleEntity)
  userRoleModel: Repository<UserRoleEntity>;

  protected getRepository(): Repository<UserRoleEntity> {
    if (!this.userRoleModel) {
      throw new BusinessError('用户角色关联模型未正确初始化', ResponseCode.INTERNAL_ERROR);
    }
    return this.userRoleModel;
  }

  /**
   * 为用户分配角色
   * @param userId 用户ID
   * @param roleIds 角色ID数组
   */
  async assignRolesToUser(userId: number, roleIds: number[]): Promise<void> {
    try {
      const repo = this.getRepository();

      // 先删除该用户的所有角色关联
      await repo.delete({ userId });

      // 创建新的关联
      if (roleIds && roleIds.length > 0) {
        const userRoles = roleIds.map((roleId) => {
          const userRole = new UserRoleEntity();
          userRole.userId = userId;
          userRole.roleId = roleId;
          return userRole;
        });

        await repo.save(userRoles);
      }
    } catch (error) {
      throw new BusinessError(`分配用户角色失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 获取用户的所有角色ID
   * @param userId 用户ID
   * @returns 角色ID数组
   */
  async getRoleIdsByUserId(userId: number): Promise<number[]> {
    try {
      const repo = this.getRepository();
      const userRoles = await repo.find({ where: { userId } });
      return userRoles.map((ur) => ur.roleId);
    } catch (error) {
      throw new BusinessError(`获取用户角色失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 获取角色的所有用户ID
   * @param roleId 角色ID
   * @returns 用户ID数组
   */
  async getUserIdsByRoleId(roleId: number): Promise<number[]> {
    try {
      const repo = this.getRepository();
      const userRoles = await repo.find({ where: { roleId } });
      return userRoles.map((ur) => ur.userId);
    } catch (error) {
      throw new BusinessError(`获取角色用户失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }
}
