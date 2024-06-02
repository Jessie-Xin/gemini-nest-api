// src/auth/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

// 定义ROLES_KEY常量，用于存储角色元数据
export const ROLES_KEY = 'roles';

// 定义Roles函数，用于设置角色元数据
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
