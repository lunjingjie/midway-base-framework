import { UserRoleEntity } from '../entity/user-role.entity';
import { RoleMenuEntity } from '../entity/role-menu.entity';

export interface Role {
  id: number;
  name: string;
  code: string; // 角色编码，如 'admin', 'user'
  description: string;
  status: number; // 0-禁用，1-启用
  userRoles?: UserRoleEntity[]; // 角色用户关联
  roleMenus?: RoleMenuEntity[]; // 角色菜单关联
  createTime: Date;
  updateTime: Date;
}

export interface RoleWithMenus extends Role {
  menuIds: number[]; // 前端展示用的菜单ID列表
}
