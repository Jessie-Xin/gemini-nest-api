// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 获取类或方法所需的role
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    // 如果没有设置role，则允许访问
    if (!requiredRoles) {
      return true;
    }
    // 获取当前登录用户的roles
    const { user } = context.switchToHttp().getRequest();

    // 如果当前登录用户的roles中包含所需的role，则允许访问
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
