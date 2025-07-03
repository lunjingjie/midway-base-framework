import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { BaseService } from './base.service';
import { PasswordUtil } from '../utils/password.util';
import { BusinessError } from '../error/base.error';
import { ResponseCode } from '../constants/response.constants';

/**
 * @description 用户服务类
 * @author AI Assistant
 * @date 2025-07-02
 */
@Provide()
export class UserService extends BaseService<UserEntity> {
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>;

  @Inject()
  passwordUtil: PasswordUtil;

  protected getRepository(): Repository<UserEntity> {
    if (!this.userModel) {
      throw new BusinessError('用户模型未正确初始化', ResponseCode.INTERNAL_ERROR);
    }
    return this.userModel;
  }

  /**
   * 创建用户（重写基类方法，增加密码加密逻辑）
   * @param user 用户对象
   * @returns 创建后的用户
   */
  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    try {
      // 检查用户名是否已存在
      const repo = this.getRepository();
      const existingUser = await repo.findOne({
        where: { username: user.username },
      });

      if (existingUser) {
        throw new BusinessError('用户名已存在', ResponseCode.BAD_REQUEST);
      }

      // 加密密码
      if (user.password) {
        user.password = await this.passwordUtil.hash(user.password);
      }

      return super.create(user);
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`创建用户失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 更新用户（重写基类方法，增加密码加密逻辑）
   * @param id 用户ID
   * @param user 用户对象
   * @returns 更新后的用户
   */
  async update(id: number | string, user: Partial<UserEntity>): Promise<UserEntity> {
    try {
      // 如果更新包含密码，则加密密码
      if (user.password) {
        user.password = await this.passwordUtil.hash(user.password);
      }

      return await super.update(id, user);
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`更新用户失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 根据用户名查找用户
   * @param username 用户名
   * @returns 用户对象
   */
  async findByUsername(username: string): Promise<UserEntity> {
    try {
      const repo = this.getRepository();
      const user = await repo.findOne({
        where: { username },
      });

      if (!user) {
        throw new BusinessError('用户不存在', ResponseCode.NOT_FOUND);
      }

      return user;
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`查询用户失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 修改用户状态
   * @param id 用户ID
   * @param status 状态值
   * @returns 更新后的用户
   */
  async changeStatus(id: number, status: number): Promise<UserEntity> {
    try {
      return await this.update(id, { status } as any);
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`修改用户状态失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }
}
