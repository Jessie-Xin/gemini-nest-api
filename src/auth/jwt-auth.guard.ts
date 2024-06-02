import { JsonWebTokenError } from '@nestjs/jwt';
// src/auth/jwt-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from './public.decorator';
import { CustomException } from 'src/common/exceptions/custom.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 获取装饰器中定义的公开方法
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // 如果方法是公开的，则直接返回true
    if (isPublic) {
      return true;
    }
    // 否则，调用父类的canActivate方法
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // 如果错误或者用户不存在，则抛出未授权异常
    if (err || !user) {
      console.log(err, user, info);
      if (info instanceof JsonWebTokenError) {
        throw new CustomException('请重新登录');
      }
      throw err || new CustomException(info.message || '用户未授权');
    }
    // 否则，返回用户
    return user;
  }
}
