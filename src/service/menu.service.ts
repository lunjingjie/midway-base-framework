import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { MenuEntity } from '../entity/menu.entity';
import { BaseService } from './base.service';
import { BusinessError } from '../error/base.error';
import { ResponseCode } from '../constants/response.constants';
import { RoleMenuService } from './role-menu.service';

/**
 * @description 菜单服务类
 * @author AI Assistant
 * @date 2025-07-02
 */
@Provide()
export class MenuService extends BaseService<MenuEntity> {
  @InjectEntityModel(MenuEntity)
  menuModel: Repository<MenuEntity>;

  @Inject()
  roleMenuService: RoleMenuService;

  protected getRepository(): Repository<MenuEntity> {
    if (!this.menuModel) {
      throw new BusinessError('菜单模型未正确初始化', ResponseCode.INTERNAL_ERROR);
    }
    return this.menuModel;
  }

  /**
   * 获取菜单树
   * @returns 菜单树结构
   */
  async getMenuTree(): Promise<any[]> {
    try {
      const repo = this.getRepository();
      const menus = await repo.find({
        order: {
          sort: 'ASC',
        },
      });

      // 构建树结构
      return this.buildTree(menus);
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`获取菜单树失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 根据角色ID获取菜单列表
   * @param roleIds 角色ID数组
   * @returns 菜单列表
   */
  async getMenusByRoleIds(roleIds: number[]): Promise<MenuEntity[]> {
    try {
      if (!roleIds || roleIds.length === 0) {
        return [];
      }

      // 获取角色对应的菜单ID
      const menuIds = await this.roleMenuService.getMenuIdsByRoleIds(roleIds);
      if (menuIds.length === 0) {
        return [];
      }

      // 查询菜单
      const repo = this.getRepository();
      return await repo.find({
        where: menuIds.map(id => ({ id })),
        order: {
          sort: 'ASC',
        },
      });
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`获取角色菜单失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 获取角色的菜单树
   * @param roleIds 角色ID数组
   * @returns 菜单树结构
   */
  async getMenuTreeByRoleIds(roleIds: number[]): Promise<any[]> {
    try {
      const menus = await this.getMenusByRoleIds(roleIds);
      return this.buildTree(menus);
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`获取角色菜单树失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 构建菜单树
   * @param menus 菜单列表
   * @param parentId 父级ID
   * @returns 树结构
   */
  private buildTree(menus: MenuEntity[], parentId: number = 0): any[] {
    const result = [];

    for (const menu of menus) {
      if (menu.parentId === parentId) {
        const children = this.buildTree(menus, menu.id);
        const node = {
          ...menu,
          children: children.length > 0 ? children : undefined,
        };
        result.push(node);
      }
    }

    return result;
  }

  /**
   * 修改菜单状态
   * @param id 菜单ID
   * @param status 状态值
   * @returns 更新后的菜单
   */
  async changeStatus(id: number, status: number): Promise<MenuEntity> {
    try {
      return await this.update(id, { status } as any);
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`修改菜单状态失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }
}