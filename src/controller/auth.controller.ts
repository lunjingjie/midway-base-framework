import { Body, Controller, Get, Inject, Post } from '@midwayjs/core';
import { AuthService } from '../service/auth.service';
import { Validate } from '@midwayjs/validate';
import { LoginDTO } from '../dto/auth.dto';
import { Context } from '@midwayjs/koa';
// import { JwtMiddleware } from '../middleware/jwt.middleware';

@Controller('/auth')
export class AuthController {
  @Inject()
  authService: AuthService;

  @Inject()
  ctx: Context;

  @Post('/login')
  @Validate()
  async login(@Body() loginDto: LoginDTO) {
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @Get('/current-user')
  // @JwtMiddleware()
  async getCurrentUser() {
    const userId = this.ctx.user.userId;
    return this.authService.getCurrentUser(userId);
  }
}
