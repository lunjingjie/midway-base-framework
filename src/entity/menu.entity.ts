import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RoleMenuEntity } from './role-menu.entity';

@Entity('sys_menu')
export class MenuEntity extends BaseEntity {
  @Column({ name: 'parent_id', default: 0 })
  parentId: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 200, nullable: true })
  path: string;

  @Column({ length: 200, nullable: true })
  component: string;

  @Column({ length: 50, nullable: true })
  icon: string;

  @Column({ default: 0 })
  sort: number;

  @Column({ default: 1 })
  type: number;

  @Column({ length: 100, nullable: true })
  permission: string;

  @Column({ default: 1 })
  status: number;
  
  @OneToMany(() => RoleMenuEntity, roleMenu => roleMenu.menu)
  roleMenus: RoleMenuEntity[];
}
