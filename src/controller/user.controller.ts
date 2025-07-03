import { Body, Controller, Get, Inject, Post, Param, Query } from '@midwayjs/core';
import { UserService } from '../service/user.service';
import { BaseController } from './base.controller';
import { UserEntity } from '../entity/user.entity';
import { Validate } from '@midwayjs/validate';
import { ResponseUtil } from '../utils/response.util';
import { BaseResponse } from '../interface';
import { CreateUserDTO, UpdateUserDTO, ChangeUserStatusDTO } from '../dto/user.dto';

/**
 * @description 用户控制器
 * @author AI Assistant
 * @date 2023-07-19
 */
@Controller('/user')
export class UserController extends BaseController<UserEntity> {
  @Inject()
  userService: UserService;

  protected getService(): UserService {
    return this.userService;
  }

  /**
   * 创建用户（重写基类方法，使用特定的DTO）
   * @param dto 创建用户DTO
   * @returns 创建结果
   */
  @Post('/create')
  @Validate()
  async create(@Body() dto: CreateUserDTO): Promise<BaseResponse<UserEntity>> {
    const entity = await this.getService().create(dto);
    return ResponseUtil.success(entity, { zh: '创建成功', en: 'Created successfully' });
  }

  /**
   * 更新用户（重写基类方法，使用特定的DTO）
   * @param id 用户ID
   * @param dto 更新用户DTO
   * @returns 更新结果
   */
  @Post('/update/:id')
  @Validate()
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateUserDTO,
  ): Promise<BaseResponse<UserEntity>> {
    const entity = await this.getService().update(id, dto);
    return ResponseUtil.success(entity, { zh: '更新成功', en: 'Updated successfully' });
  }

  /**
   * 根据用户名查找用户
   * @param username 用户名
   * @returns 用户对象
   */
  @Get('/find-by-username')
  async findByUsername(@Query('username') username: string): Promise<BaseResponse<UserEntity>> {
    const user = await this.userService.findByUsername(username);
    return ResponseUtil.success(user);
  }

  /**
   * 修改用户状态
   * @param id 用户ID
   * @param status 状态值
   * @returns 更新后的用户
   */
  @Post('/change-status/:id')
  @Validate()
  async changeStatus(
    @Param('id') id: number,
    @Body() dto: ChangeUserStatusDTO,
  ): Promise<BaseResponse<UserEntity>> {
    const user = await this.userService.changeStatus(id, dto.status);
    return ResponseUtil.success(user, { zh: '状态修改成功', en: 'Status changed successfully' });
  }
}
