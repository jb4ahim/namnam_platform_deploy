import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerModule } from 'nest generate library auth/common/logger';
import { GlobalExceptionFilter } from 'nest generate library auth/common/filters/global-exception.filter';
import { ResponseEnvelopeInterceptor } from 'nest generate library auth/common/interceptors/response-envelope.interceptor';

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
