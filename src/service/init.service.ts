import { Provide, Inject, Init } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../entity/role.entity';
import { MenuEntity } from '../entity/menu.entity';
import { RoleMenuService } from './role-menu.service';

/**
 * @description 系统初始化服务
 * @author AI Assistant
 * @date 2025-07-02
 */
@Provide()
export class InitService {
  @InjectEntityModel(RoleEntity)
  roleModel: Repository<RoleEntity>;

  @InjectEntityModel(MenuEntity)
  menuModel: Repository<MenuEntity>;

  @Inject()
  roleMenuService: RoleMenuService;

  @Init()
  async init() {
    // 初始化角色
    await this.initRoles();
    // 初始化菜单
    await this.initMenus();
    // 初始化角色菜单关系
    await this.initRoleMenus();
  }

  /**
   * 初始化角色
   */
  private async initRoles() {
    const roles = [
      {
        name: '超级管理员',
        code: 'admin',
        description: '系统超级管理员，拥有所有权限',
        status: 1,
      },
      {
        name: '普通用户',
        code: 'user',
        description: '普通用户，拥有基本权限',
        status: 1,
      },
    ];

    for (const role of roles) {
      const existingRole = await this.roleModel.findOne({
        where: { code: role.code },
      });

      if (!existingRole) {
        await this.roleModel.save(this.roleModel.create(role));
      }
    }
  }

  /**
   * 初始化菜单
   */
  private async initMenus() {
    const menus = [
      {
        parentId: 0,
        name: '系统管理',
        path: '/system',
        component: 'Layout',
        icon: 'setting',
        sort: 1,
        type: 0, // 目录
        permission: '',
        status: 1,
      },
      {
        parentId: 1,
        name: '用户管理',
        path: '/system/user',
        component: 'system/user/index',
        icon: 'user',
        sort: 1,
        type: 1, // 菜单
        permission: 'system:user:list',
        status: 1,
      },
      {
        parentId: 1,
        name: '角色管理',
        path: '/system/role',
        component: 'system/role/index',
        icon: 'peoples',
        sort: 2,
        type: 1, // 菜单
        permission: 'system:role:list',
        status: 1,
      },
      {
        parentId: 1,
        name: '菜单管理',
        path: '/system/menu',
        component: 'system/menu/index',
        icon: 'tree-table',
        sort: 3,
        type: 1, // 菜单
        permission: 'system:menu:list',
        status: 1,
      },
      {
        parentId: 0,
        name: '个人中心',
        path: '/profile',
        component: 'Layout',
        icon: 'user',
        sort: 10,
        type: 0, // 目录
        permission: '',
        status: 1,
      },
      {
        parentId: 5,
        name: '个人信息',
        path: '/profile/index',
        component: 'profile/index',
        icon: 'user',
        sort: 1,
        type: 1, // 菜单
        permission: 'system:profile:view',
        status: 1,
      },
    ];

    for (const menu of menus) {
      const existingMenu = await this.menuModel.findOne({
        where: { name: menu.name, parentId: menu.parentId },
      });

      if (!existingMenu) {
        await this.menuModel.save(this.menuModel.create(menu));
      }
    }
  }

  /**
   * 初始化角色菜单关系
   */
  private async initRoleMenus() {
    // 获取角色
    const adminRole = await this.roleModel.findOne({ where: { code: 'admin' } });
    const userRole = await this.roleModel.findOne({ where: { code: 'user' } });

    if (!adminRole || !userRole) {
      return;
    }

    // 获取所有菜单ID
    const allMenus = await this.menuModel.find();
    const allMenuIds = allMenus.map(menu => menu.id);

    // 获取用户可访问的菜单ID（个人中心相关）
    const userMenus = await this.menuModel.find({
      where: [
        { parentId: 5 }, // 个人中心下的菜单
        { id: 5 }, // 个人中心目录
      ],
    });
    const userMenuIds = userMenus.map(menu => menu.id);

    // 为管理员分配所有菜单
    await this.roleMenuService.assignMenusToRole(adminRole.id, allMenuIds);

    // 为普通用户分配个人中心菜单
    await this.roleMenuService.assignMenusToRole(userRole.id, userMenuIds);
  }
}