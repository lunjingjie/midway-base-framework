import { Rule, RuleType } from '@midwayjs/validate';

export class LoginDTO {
  @Rule(RuleType.string().required().min(3).max(20))
  username: string;

  @Rule(RuleType.string().required().min(6).max(20))
  password: string;
}

export class RegisterDTO {
  @Rule(RuleType.string().required().min(3).max(50))
  username: string;

  @Rule(RuleType.string().required().min(6).max(20))
  password: string;

  @Rule(RuleType.string().required().min(6).max(20))
  confirmPassword: string;

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
}
