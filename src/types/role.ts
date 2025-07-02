export interface Role {
  id: number;
  name: string;
  code: string; // 角色编码，如 'admin', 'user'
  description: string;
  status: number; // 0-禁用，1-启用
  menuIds: number[]; // 关联的菜单ID
  createTime: Date;
  updateTime: Date;
}
