import { RoleMenuEntity } from '../entity/role-menu.entity';

export interface Menu {
  id: number;
  parentId: number; // 父菜单ID，0表示顶级菜单
  name: string;
  path: string; // 前端路由路径
  component: string; // 前端组件路径
  icon: string;
  sort: number; // 排序
  type: number; // 类型：0-目录，1-菜单，2-按钮
  permission: string; // 权限标识
  status: number; // 0-禁用，1-启用
  roleMenus?: RoleMenuEntity[]; // 菜单角色关联
  createTime: Date;
  updateTime: Date;
}

export interface MenuTree extends Omit<Menu, 'roleMenus'> {
  children?: MenuTree[];
}
