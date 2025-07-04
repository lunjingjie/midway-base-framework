import { UserRoleEntity } from '../entity/user-role.entity';

export interface User {
  id: number;
  username: string;
  password: string; // 存储加密后的密码
  realName: string;
  email: string;
  phone: string;
  status: number; // 0-禁用，1-启用
  userRoles?: UserRoleEntity[]; // 用户角色关联
  createTime: Date;
  updateTime: Date;
}

export interface UserWithRoles extends User {
  roleIds: number[]; // 前端展示用的角色ID列表
  menuIds?: number[]; // 前端展示用的菜单ID列表
}
