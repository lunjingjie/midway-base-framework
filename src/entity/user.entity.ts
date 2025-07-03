import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('sys_user')
export class UserEntity extends BaseEntity {
  @Column({ length: 50, unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ name: 'real_name', length: 50, nullable: true })
  realName: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ default: 1 })
  status: number;

  @Column({ name: 'role_ids', type: 'simple-json', nullable: true })
  roleIds: number[];
}
