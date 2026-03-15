import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;

    const raw =
      exceptionResponse && typeof exceptionResponse === 'object'
        ? (exceptionResponse as any).message
        : exceptionResponse || 'Internal server error';

    const isValidationError = Array.isArray(raw) && typeof raw[0] === 'object';

    if (isValidationError) {
      return response.status(status).json({
        status: 'error',
        error: {
          code: status,
          message: 'Bad request',
          details: raw,
        },
      });
    }

    const message = Array.isArray(raw) ? raw[0] : raw;
    return response.status(status).json({
      status: 'error',
      error: {
        code: status,
        message,
      },
    });
  }
}
