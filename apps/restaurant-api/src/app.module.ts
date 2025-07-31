import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core/constants';
import { GlobalExceptionFilter } from '@namnam/common/filters/global-exception.filter';
import { ResponseEnvelopeInterceptor } from '@namnam/common/interceptors/response-envelope.interceptor';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseEnvelopeInterceptor,
    }
  ]
})
export class AppModule {}
