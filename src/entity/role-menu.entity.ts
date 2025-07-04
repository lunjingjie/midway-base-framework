import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RoleEntity } from './role.entity';
import { MenuEntity } from './menu.entity';

/**
 * @description 角色-菜单关联表
 * @author AI Assistant
 * @date 2025-07-02
 */
@Entity('sys_role_menu')
export class RoleMenuEntity extends BaseEntity {
  @Column({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'menu_id' })
  menuId: number;

  @ManyToOne(() => RoleEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @ManyToOne(() => MenuEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_id' })
  menu: MenuEntity;
}
