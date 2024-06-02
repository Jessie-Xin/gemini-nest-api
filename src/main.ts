import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
async function bootstrap() {
  console.log(process.env.NODE_ENV);

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api/v1'); // 设置全局前缀，比如 'api'
  //全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  // 注册全局响应拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());
  //全局守卫
  await app.listen(3000);
}
bootstrap();
