// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-auth.dto';
import { Public } from './public.decorator';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const doc = await this.authService.signUp(createUserDto);
    return doc;
  }

  @Post('signin')
  async signIn(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.authService.signIn(email, password);
  }
  //已知旧密码重置密码
  @Post('reset')
  async reset(
    @Body('email') email: string,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return await this.authService.reset(email, oldPassword, newPassword);
  }
  //不知道密码，忘记密码
  @Post('forget')
  async forget(@Body('email') email: string) {
    return this.authService.forget(email);
  }
}
