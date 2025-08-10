import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { GlobalExceptionFilter } from 'nest generate library auth/common/filters/global-exception.filter';
import { LoggerModule } from 'nest generate library auth/common/logger';
import { ResponseEnvelopeInterceptor } from 'nest generate library auth/common/interceptors/response-envelope.interceptor';
import { UploadsModule } from './modules/uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule, 
    AuthModule, 
    LoggerModule,
    UploadsModule
  ],
  providers: [
    {
        provide: APP_FILTER,
        useClass: GlobalExceptionFilter
    },
    {
        provide: APP_INTERCEPTOR,
        useClass: ResponseEnvelopeInterceptor
    },
  ],
})
export class NamnamCustomerApiModule {}
