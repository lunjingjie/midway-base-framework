import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserRoleEntity } from './user-role.entity';
import { RoleMenuEntity } from './role-menu.entity';

@Entity('sys_role')
export class RoleEntity extends BaseEntity {
  @Column({ length: 50 })
  name: string;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ length: 200, nullable: true })
  description: string;

  @Column({ default: 1 })
  status: number;
  
  @OneToMany(() => UserRoleEntity, userRole => userRole.role)
  userRoles: UserRoleEntity[];
  
  @OneToMany(() => RoleMenuEntity, roleMenu => roleMenu.role)
  roleMenus: RoleMenuEntity[];
}
