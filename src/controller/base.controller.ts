import { Body, Get, Param, Post, Put, Query, Patch } from '@midwayjs/core';
import { BaseService } from '../service/base.service';
import { ResponseUtil } from '../utils/response.util';
import { BaseResponse } from '../interface';
import { Validate } from '@midwayjs/validate';

/**
 * @description 基础控制器类，提供通用的CRUD操作
 * @author AI Assistant
 * @date 2025-07-02
 */
export abstract class BaseController<T> {
  // 子类需要注入具体的Service
  protected abstract getService(): BaseService<T>;

  /**
   * 创建实体
   * @param dto 数据传输对象
   * @returns 创建结果
   */
  @Post('/create')
  @Validate()
  async create(@Body() dto: any): Promise<BaseResponse<T>> {
    const entity = await this.getService().create(dto);
    return ResponseUtil.success(entity, { zh: '创建成功', en: 'Created successfully' });
  }

  /**
   * 批量创建实体
   * @param dtos 数据传输对象数组
   * @returns 创建结果
   */
  @Post('/create-many')
  @Validate()
  async createMany(@Body() dtos: any[]): Promise<BaseResponse<T[]>> {
    const entities = await this.getService().createMany(dtos);
    return ResponseUtil.success(entities, { zh: '批量创建成功', en: 'Batch created successfully' });
  }

  /**
   * 根据ID查询
   * @param id 记录ID
   * @param withDeleted 是否包含已删除的记录
   * @returns 查询结果
   */
  @Get('/detail/:id')
  async findById(
    @Param('id') id: number | string,
    @Query('withDeleted') withDeleted?: boolean,
  ): Promise<BaseResponse<T>> {
    const entity = await this.getService().findById(id, withDeleted);
    return ResponseUtil.success(entity);
  }

  /**
   * 查询所有
   * @param withDeleted 是否包含已删除的记录
   * @returns 查询结果
   */
  @Get('/list')
  async findAll(@Query('withDeleted') withDeleted?: boolean): Promise<BaseResponse<T[]>> {
    const entities = await this.getService().findAll(undefined, withDeleted);
    return ResponseUtil.success(entities);
  }

  /**
   * 分页查询
   * @param page 页码
   * @param pageSize 每页大小
   * @param withDeleted 是否包含已删除的记录
   * @returns 分页结果
   */
  @Get('/page')
  async findByPage(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('withDeleted') withDeleted?: boolean,
  ): Promise<BaseResponse<{ items: T[]; total: number; page: number; pageSize: number }>> {
    const result = await this.getService().findByPage(page, pageSize, undefined, withDeleted);
    return ResponseUtil.success(result);
  }

  /**
   * 更新实体
   * @param id 实体ID
   * @param dto 数据传输对象
   * @returns 更新结果
   */
  @Put('/update/:id')
  @Validate()
  async update(@Param('id') id: number | string, @Body() dto: any): Promise<BaseResponse<T>> {
    const entity = await this.getService().update(id, dto);
    return ResponseUtil.success(entity, { zh: '更新成功', en: 'Updated successfully' });
  }

  /**
   * 删除实体
   * @param id 实体ID
   * @returns 删除结果
   */
  @Post('/delete/:id')
  async delete(@Param('id') id: number | string): Promise<BaseResponse<boolean>> {
    const result = await this.getService().delete(id);
    return ResponseUtil.success(result, { zh: '删除成功', en: 'Deleted successfully' });
  }

  /**
   * 批量删除实体
   * @param ids 实体ID数组
   * @returns 删除结果
   */
  @Post('/delete-many')
  async deleteMany(@Body() ids: (number | string)[]): Promise<BaseResponse<boolean>> {
    const result = await this.getService().deleteMany(ids);
    return ResponseUtil.success(result, { zh: '批量删除成功', en: 'Batch deleted successfully' });
  }

  /**
   * 恢复已删除的记录
   * @param id 记录ID
   * @returns 恢复结果
   */
  @Patch('/restore/:id')
  async restore(@Param('id') id: number | string): Promise<BaseResponse<boolean>> {
    const result = await this.getService().restore(id);
    return ResponseUtil.success(result, { zh: '恢复成功', en: 'Restored successfully' });
  }

  /**
   * 批量恢复已删除的记录
   * @param ids ID数组
   * @returns 恢复结果
   */
  @Patch('/restore-many')
  async restoreMany(@Body('ids') ids: (number | string)[]): Promise<BaseResponse<boolean>> {
    const result = await this.getService().restoreMany(ids);
    return ResponseUtil.success(result, { zh: '批量恢复成功', en: 'Batch restored successfully' });
  }

  /**
   * 计算总数
   * @param where 查询条件
   * @param withDeleted 是否包含已删除的记录
   * @returns 总数
   */
  @Get('/count')
  async count(
    @Query() where?: any,
    @Query('withDeleted') withDeleted?: boolean,
  ): Promise<BaseResponse<number>> {
    const count = await this.getService().count(where, withDeleted);
    return ResponseUtil.success(count);
  }
}
