import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../entity/role.entity';
import { BaseService } from './base.service';
import { BusinessError } from '../error/base.error';
import { ResponseCode } from '../constants/response.constants';
import { RoleMenuService } from './role-menu.service';
import { UserRoleService } from './user-role.service';

/**
 * @description 角色服务类
 * @author AI Assistant
 * @date 2025-07-02
 */
@Provide()
export class RoleService extends BaseService<RoleEntity> {
  @InjectEntityModel(RoleEntity)
  roleModel: Repository<RoleEntity>;

  @Inject()
  roleMenuService: RoleMenuService;

  @Inject()
  userRoleService: UserRoleService;

  protected getRepository(): Repository<RoleEntity> {
    if (!this.roleModel) {
      throw new BusinessError('角色模型未正确初始化', ResponseCode.INTERNAL_ERROR);
    }
    return this.roleModel;
  }

  /**
   * 创建角色
   * @param role 角色对象
   * @param menuIds 菜单ID数组
   * @returns 创建后的角色
   */
  async create(role: Partial<RoleEntity>, menuIds?: number[]): Promise<RoleEntity> {
    try {
      // 检查角色编码是否已存在
      const repo = this.getRepository();
      const existingRole = await repo.findOne({
        where: { code: role.code },
      });

      if (existingRole) {
        throw new BusinessError('角色编码已存在', ResponseCode.BAD_REQUEST);
      }

      // 创建角色
      const newRole = await super.create(role);

      // 分配菜单
      if (menuIds && menuIds.length > 0) {
        await this.roleMenuService.assignMenusToRole(newRole.id, menuIds);
      }

      return newRole;
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`创建角色失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 更新角色
   * @param id 角色ID
   * @param role 角色对象
   * @param menuIds 菜单ID数组
   * @returns 更新后的角色
   */
  async update(
    id: number | string,
    role: Partial<RoleEntity>,
    menuIds?: number[],
  ): Promise<RoleEntity> {
    try {
      // 更新角色
      const updatedRole = await super.update(id, role);

      // 更新菜单
      if (menuIds) {
        await this.roleMenuService.assignMenusToRole(Number(id), menuIds);
      }

      return updatedRole;
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`更新角色失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 获取角色的菜单ID列表
   * @param roleId 角色ID
   * @returns 菜单ID数组
   */
  async getRoleMenuIds(roleId: number): Promise<number[]> {
    try {
      return await this.roleMenuService.getMenuIdsByRoleId(roleId);
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`获取角色菜单失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 获取角色的用户ID列表
   * @param roleId 角色ID
   * @returns 用户ID数组
   */
  async getRoleUserIds(roleId: number): Promise<number[]> {
    try {
      return await this.userRoleService.getUserIdsByRoleId(roleId);
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`获取角色用户失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 修改角色状态
   * @param id 角色ID
   * @param status 状态值
   * @returns 更新后的角色
   */
  async changeStatus(id: number, status: number): Promise<RoleEntity> {
    try {
      return await this.update(id, { status } as any);
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`修改角色状态失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }
}
