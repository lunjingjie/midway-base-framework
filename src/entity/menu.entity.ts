import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sys_menu')
export class MenuEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
