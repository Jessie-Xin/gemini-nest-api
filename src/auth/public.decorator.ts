// src/auth/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

// 导出一个常量，用于标记公共路由
export const IS_PUBLIC_KEY = 'isPublic';

// 导出一个函数，用于标记一个路由为公共路由
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
