import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sys_role')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
