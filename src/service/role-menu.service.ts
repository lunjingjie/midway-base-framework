import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { RoleMenuEntity } from '../entity/role-menu.entity';
import { BaseService } from './base.service';
import { BusinessError } from '../error/base.error';
import { ResponseCode } from '../constants/response.constants';

/**
 * @description 角色-菜单关联服务
 * @author AI Assistant
 * @date 2025-07-02
 */
@Provide()
export class RoleMenuService extends BaseService<RoleMenuEntity> {
  @InjectEntityModel(RoleMenuEntity)
  roleMenuModel: Repository<RoleMenuEntity>;

  protected getRepository(): Repository<RoleMenuEntity> {
    if (!this.roleMenuModel) {
      throw new BusinessError('角色菜单关联模型未正确初始化', ResponseCode.INTERNAL_ERROR);
    }
    return this.roleMenuModel;
  }

  /**
   * 为角色分配菜单
   * @param roleId 角色ID
   * @param menuIds 菜单ID数组
   */
  async assignMenusToRole(roleId: number, menuIds: number[]): Promise<void> {
    try {
      const repo = this.getRepository();
      
      // 先删除该角色的所有菜单关联
      await repo.delete({ roleId });
      
      // 创建新的关联
      if (menuIds && menuIds.length > 0) {
        const roleMenus = menuIds.map(menuId => {
          const roleMenu = new RoleMenuEntity();
          roleMenu.roleId = roleId;
          roleMenu.menuId = menuId;
          return roleMenu;
        });
        
        await repo.save(roleMenus);
      }
    } catch (error) {
      throw new BusinessError(`分配角色菜单失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 获取角色的所有菜单ID
   * @param roleId 角色ID
   * @returns 菜单ID数组
   */
  async getMenuIdsByRoleId(roleId: number): Promise<number[]> {
    try {
      const repo = this.getRepository();
      const roleMenus = await repo.find({ where: { roleId } });
      return roleMenus.map(rm => rm.menuId);
    } catch (error) {
      throw new BusinessError(`获取角色菜单失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 获取菜单的所有角色ID
   * @param menuId 菜单ID
   * @returns 角色ID数组
   */
  async getRoleIdsByMenuId(menuId: number): Promise<number[]> {
    try {
      const repo = this.getRepository();
      const roleMenus = await repo.find({ where: { menuId } });
      return roleMenus.map(rm => rm.roleId);
    } catch (error) {
      throw new BusinessError(`获取菜单角色失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 获取用户的所有菜单ID
   * @param roleIds 角色ID数组
   * @returns 菜单ID数组
   */
  async getMenuIdsByRoleIds(roleIds: number[]): Promise<number[]> {
    try {
      if (!roleIds || roleIds.length === 0) {
        return [];
      }
      
      const repo = this.getRepository();
      const roleMenus = await repo.find({
        where: roleIds.map(roleId => ({ roleId })),
      });
      
      // 去重
      return [...new Set(roleMenus.map(rm => rm.menuId))];
    } catch (error) {
      throw new BusinessError(`获取用户菜单失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }
}