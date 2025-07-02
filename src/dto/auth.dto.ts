import { Rule, RuleType } from '@midwayjs/validate';

export class LoginDTO {
  @Rule(RuleType.string().required().min(3).max(20))
  username: string;

  @Rule(RuleType.string().required().min(6).max(20))
  password: string;
}
