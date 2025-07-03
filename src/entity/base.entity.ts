import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * @description 基础实体类，提供通用字段
 * @author AI Assistant
 * @date 2025-07-02
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;

  @DeleteDateColumn({ name: 'delete_time', nullable: true })
  deleteTime: Date;
}
