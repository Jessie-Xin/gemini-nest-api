import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoServerError } from 'mongodb';
import { CustomException } from '../exceptions/custom.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    this.logger.log('进入全局异常过滤器...');

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: any;
    let error: string;

    if (exception instanceof CustomException) {
      message = exception.message;
      error = exception.name;
    } else if (exception instanceof ForbiddenException) {
      message = '没有权限';
      error = 'Forbidden';
    } else if (exception instanceof BadRequestException) {
      const responseMessage = exception.getResponse();
      if (typeof responseMessage === 'object' && 'message' in responseMessage) {
        message = responseMessage['message'][0];
      } else {
        message = responseMessage;
      }
      error = 'Bad Request';
    } else if (
      exception instanceof MongoServerError &&
      exception.code === 11000
    ) {
      message = 'Duplicate key error';
      error = 'MongoServerError';
    } else if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        message = exceptionResponse['message'];
      } else {
        message = exceptionResponse;
      }
      error = exception.name;
    } else {
      message = '服务器异常';
      error = 'Internal Server Error';
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: '请求失败',
      data: {
        message: message,
        error: error,
        statusCode: status,
      },
    };
    console.log('exception', exception);

    this.logger.error('错误信息', JSON.stringify(errorResponse));

    response.status(status).json(errorResponse);
  }
}
