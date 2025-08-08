import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from '@namnam/common/filters/global-exception.filter';
import { ResponseEnvelopeInterceptor } from '@namnam/common/interceptors/response-envelope.interceptor';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@namnam/common/logger';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true,
    }),
    LoggerModule,
    AuthModule
  ],
  providers: [ {
        provide: APP_FILTER,
        useClass: GlobalExceptionFilter
      },
      {
        provide: APP_INTERCEPTOR,
        useClass: ResponseEnvelopeInterceptor
      },
  ],
})
export class NamnamManagementApiModule {}
