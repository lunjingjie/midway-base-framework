import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserRoleEntity } from './user-role.entity';

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

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.user)
  userRoles: UserRoleEntity[];
}
