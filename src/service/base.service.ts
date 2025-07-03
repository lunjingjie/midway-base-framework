import { Provide } from '@midwayjs/core';
import { Repository, FindOptionsWhere, FindManyOptions } from 'typeorm';
import { BusinessError } from '../error/base.error';
import { ResponseCode } from '../constants/response.constants';

/**
 * @description 基础服务类，提供通用的CRUD操作
 * @author AI Assistant
 * @date 2025-07-02
 */
@Provide()
export abstract class BaseService<T> {
  // 子类需要注入具体的Repository
  protected abstract getRepository(): Repository<T>;

  /**
   * 创建实体
   * @param entity 实体对象
   * @returns 创建后的实体
   */
  async create(entity: Partial<T>): Promise<T> {
    try {
      const repo = this.getRepository();
      // 直接使用save方法，TypeORM会自动处理实体创建
      return await repo.save(entity as any);
    } catch (error) {
      throw new BusinessError(`创建失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 批量创建实体
   * @param entities 实体对象数组
   * @returns 创建后的实体数组
   */
  async createMany(entities: Partial<T>[]): Promise<T[]> {
    try {
      const repo = this.getRepository();
      // 直接使用save方法，TypeORM会自动处理实体创建
      return await repo.save(entities as any);
    } catch (error) {
      throw new BusinessError(`批量创建失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 根据ID查找实体
   * @param id 实体ID
   * @param withDeleted 是否包含已删除的记录，默认不包含
   * @returns 查找到的实体或null
   */
  async findById(id: number | string, withDeleted = false): Promise<T> {
    try {
      const repo = this.getRepository();
      const entity = await repo.findOne({
        where: { id: id } as unknown as FindOptionsWhere<T>,
        withDeleted: withDeleted,
      });

      if (!entity) {
        throw new BusinessError('未找到指定记录', ResponseCode.NOT_FOUND);
      }

      return entity;
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`查询失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 根据条件查找单个实体
   * @param where 查询条件
   * @param withDeleted 是否包含已删除的记录，默认不包含
   * @returns 查找到的实体或null
   */
  async findOne(where: FindOptionsWhere<T>, withDeleted = false): Promise<T> {
    try {
      const repo = this.getRepository();
      const entity = await repo.findOne({
        where,
        withDeleted: withDeleted,
      });

      if (!entity) {
        throw new BusinessError('未找到指定记录', ResponseCode.NOT_FOUND);
      }

      return entity;
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`查询失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 查找所有实体
   * @param options 查询选项
   * @param withDeleted 是否包含已删除的记录，默认不包含
   * @returns 实体数组
   */
  async findAll(options?: FindManyOptions<T>, withDeleted = false): Promise<T[]> {
    try {
      const repo = this.getRepository();
      return await repo.find({
        ...options,
        withDeleted: withDeleted,
      });
    } catch (error) {
      throw new BusinessError(`查询失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 分页查询
   * @param page 页码
   * @param pageSize 每页大小
   * @param options 查询选项
   * @param withDeleted 是否包含已删除的记录，默认不包含
   * @returns 分页结果
   */
  async findByPage(
    page = 1,
    pageSize = 10,
    options?: FindManyOptions<T>,
    withDeleted = false,
  ): Promise<{ items: T[]; total: number; page: number; pageSize: number }> {
    try {
      const repo = this.getRepository();
      const [items, total] = await repo.findAndCount({
        ...options,
        skip: (page - 1) * pageSize,
        take: pageSize,
        withDeleted: withDeleted,
      });

      return {
        items,
        total,
        page,
        pageSize,
      };
    } catch (error) {
      throw new BusinessError(`分页查询失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 更新实体
   * @param id 实体ID
   * @param partialEntity 部分实体对象
   * @returns 更新后的实体
   */
  async update(id: number | string, partialEntity: Partial<T>): Promise<T> {
    try {
      const repo = this.getRepository();
      const existingEntity = await this.findById(id);

      if (!existingEntity) {
        throw new BusinessError('未找到要更新的记录', ResponseCode.NOT_FOUND);
      }

      const updatedEntity = repo.merge(existingEntity, partialEntity as any);
      return await repo.save(updatedEntity);
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`更新失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 软删除实体
   * @param id 实体ID
   * @returns 删除结果
   */
  async delete(id: number | string): Promise<boolean> {
    try {
      const repo = this.getRepository();
      const entity = await this.findById(id);

      if (!entity) {
        throw new BusinessError('未找到要删除的记录', ResponseCode.NOT_FOUND);
      }

      // 使用软删除 - 设置deleteTime字段
      // 将ID转换为TypeORM期望的类型
      await repo.softDelete(id as any);
      return true;
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`删除失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 批量软删除实体
   * @param ids 实体ID数组
   * @returns 删除结果
   */
  async deleteMany(ids: (number | string)[]): Promise<boolean> {
    try {
      const repo = this.getRepository();

      // 验证所有ID是否存在
      const existingEntities = [];
      for (const id of ids) {
        try {
          const entity = await this.findById(id);
          if (entity) {
            existingEntities.push(entity);
          }
        } catch (e) {
          // 忽略未找到的实体
        }
      }

      if (existingEntities.length === 0) {
        throw new BusinessError('未找到要删除的记录', ResponseCode.NOT_FOUND);
      }

      // 使用软删除 - 批量设置deleteTime字段
      // 将混合类型的ID数组转换为TypeORM期望的类型
      await repo.softDelete(ids as any);
      return true;
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`批量删除失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 计算总数
   * @param where 查询条件
   * @param withDeleted 是否包含已删除的记录，默认不包含
   * @returns 总数
   */
  async count(where?: FindOptionsWhere<T>, withDeleted = false): Promise<number> {
    try {
      const repo = this.getRepository();
      return await repo.count({
        where,
        withDeleted: withDeleted,
      });
    } catch (error) {
      throw new BusinessError(`计数失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 恢复已软删除的实体
   * @param id 实体ID
   * @returns 恢复结果
   */
  async restore(id: number | string): Promise<boolean> {
    try {
      const repo = this.getRepository();
      // 先检查记录是否存在（包括已删除的）
      const entity = await this.findById(id, true);

      if (!entity) {
        throw new BusinessError('未找到要恢复的记录', ResponseCode.NOT_FOUND);
      }

      // 检查记录是否已被删除
      if (!(entity as any).deleteTime) {
        throw new BusinessError('该记录未被删除，无需恢复', ResponseCode.BAD_REQUEST);
      }

      // 恢复记录
      // 将ID转换为TypeORM期望的类型
      await repo.restore(id as any);
      return true;
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`恢复记录失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }

  /**
   * 批量恢复已软删除的实体
   * @param ids 实体ID数组
   * @returns 恢复结果
   */
  async restoreMany(ids: (number | string)[]): Promise<boolean> {
    try {
      const repo = this.getRepository();

      // 验证所有ID是否存在且已被删除
      const existingEntities = [];
      for (const id of ids) {
        try {
          const entity = await this.findById(id, true);
          if (entity && (entity as any).deleteTime) {
            existingEntities.push(entity);
          }
        } catch (e) {
          // 忽略未找到的实体
        }
      }

      if (existingEntities.length === 0) {
        throw new BusinessError('未找到要恢复的已删除记录', ResponseCode.NOT_FOUND);
      }

      // 批量恢复记录
      // 将混合类型的ID数组转换为TypeORM期望的类型
      await repo.restore(ids as any);
      return true;
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError(`批量恢复记录失败: ${error.message}`, ResponseCode.INTERNAL_ERROR);
    }
  }
}
