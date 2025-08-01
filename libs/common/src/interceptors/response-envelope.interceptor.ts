import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoggerService } from '../logger';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResponseEnvelopeInterceptor<T> implements NestInterceptor<T, any> {
  constructor(
    private readonly logger: LoggerService,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = response.statusCode || 200;

    const startTime = Date.now();
    
    // Log incoming request
    this.logger.log(
      `Incoming request: ${request.method} ${request.url}`,
    );

    return next.handle().pipe(
      tap(() => {
        // Log response processing time
        const processingTime = Date.now() - startTime;
        this.logger.log(
          `Request processed: ${request.method} ${request.url} - ${statusCode} - ${processingTime}ms`,
        );
      }),
      map((data) => {
        // Log response envelope creation
        this.logger.debug(
          `Response envelope created for: ${request.method} ${request.url} - Data type: ${typeof data}`,
        );

        return {
          success: true,
          statusCode,
          message: 'Success',
          data,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }),
    );
  }
}