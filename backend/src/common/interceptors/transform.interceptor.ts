import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        let responseData = data;
        let meta = undefined;

        if (data?.meta) {
          responseData = data.data;
          meta = data.meta;
        } else if (data?.data !== undefined) {
          responseData = data.data;
        }
        if (responseData && typeof responseData === 'object' && 'message' in responseData) {
          const { message, ...rest } = responseData;
          responseData = rest;
        }

        return {
          status: 'success',
          data: responseData,
          ...(meta ? { meta } : {}),
        };
      }),
    );
  }
}
