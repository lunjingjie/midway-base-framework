import { Provide } from '@midwayjs/core';
import * as bcrypt from 'bcryptjs';

@Provide()
export class PasswordUtil {
  // 加密密码
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  // 验证密码
  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
