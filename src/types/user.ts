export interface User {
  id: number;
  username: string;
  password: string; // 存储加密后的密码
  realName: string;
  email: string;
  phone: string;
  status: number; // 0-禁用，1-启用
  roleIds: number[]; // 关联的角色ID
  createTime: Date;
  updateTime: Date;
}
