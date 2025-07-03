import { Rule, RuleType } from '@midwayjs/validate';

/**
 * @description 创建用户DTO
 * @author AI Assistant
 * @date 2023-07-19
 */
export class CreateUserDTO {
  @Rule(RuleType.string().required().min(3).max(50))
  username: string;

  @Rule(RuleType.string().required().min(6).max(20))
  password: string;

  @Rule(RuleType.string().max(50).optional())
  realName?: string;

  @Rule(RuleType.string().email().max(100).optional())
  email?: string;

  @Rule(
    RuleType.string()
      .pattern(/^1[3-9]\d{9}$/)
      .max(20)
      .optional(),
  )
  phone?: string;

  @Rule(RuleType.number().valid(0, 1).default(1))
  status?: number;

  @Rule(RuleType.array().items(RuleType.number()).optional())
  roleIds?: number[];
}

/**
 * @description 更新用户DTO
 * @author AI Assistant
 * @date 2023-07-19
 */
export class UpdateUserDTO {
  @Rule(RuleType.string().min(6).max(20).optional())
  password?: string;

  @Rule(RuleType.string().max(50).optional())
  realName?: string;

  @Rule(RuleType.string().email().max(100).optional())
  email?: string;

  @Rule(
    RuleType.string()
      .pattern(/^1[3-9]\d{9}$/)
      .max(20)
      .optional(),
  )
  phone?: string;

  @Rule(RuleType.number().valid(0, 1).optional())
  status?: number;

  @Rule(RuleType.array().items(RuleType.number()).optional())
  roleIds?: number[];
}

/**
 * @description 修改用户状态DTO
 * @author AI Assistant
 * @date 2023-07-19
 */
export class ChangeUserStatusDTO {
  @Rule(RuleType.number().valid(0, 1).required())
  status: number;
}
