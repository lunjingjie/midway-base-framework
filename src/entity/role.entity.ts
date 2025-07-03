import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

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

  @Column({ name: 'menu_ids', type: 'simple-json', nullable: true })
  menuIds: number[];
}
