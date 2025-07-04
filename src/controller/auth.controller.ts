import { Body, Controller, Get, Inject, Post } from '@midwayjs/core';
import { AuthService } from '../service/auth.service';
import { Validate } from '@midwayjs/validate';
import { LoginDTO, RegisterDTO } from '../dto/auth.dto';
import { Context } from '@midwayjs/koa';
import { ApiTags, ApiOperation } from '@midwayjs/swagger';
import { SkipAuth } from '../decorator/skip-auth.decorator';
// import { JwtMiddleware } from '../middleware/jwt.middleware';

@ApiTags(['认证管理'])
@Controller('/auth')
export class AuthController {
  @Inject()
  authService: AuthService;

  @Inject()
  ctx: Context;

  @ApiOperation({
    summary: '用户登录',
    description: '用户登录接口，返回token和用户信息',
  })
  @Post('/login')
  @Validate()
  @SkipAuth()
  async login(@Body() loginDto: LoginDTO) {
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @ApiOperation({
    summary: '用户注册',
    description: '用户注册接口，注册成功后返回token和用户信息',
  })
  @Post('/register')
  @Validate()
  @SkipAuth()
  async register(@Body() registerDto: RegisterDTO) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({
    summary: '获取当前用户信息',
    description: '获取当前登录用户的详细信息，包括角色和菜单权限',
  })
  @Get('/current-user')
  // @JwtMiddleware()
  async getCurrentUser() {
    const userId = this.ctx.user.userId;
    return this.authService.getCurrentUser(userId);
  }
}
