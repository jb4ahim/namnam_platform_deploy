import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseEnvelopeInterceptor } from '@namnam/common/interceptors/response-envelope.interceptor';
import { GlobalExceptionFilter } from '@namnam/common/filters/global-exception.filter';
import { DatabaseModule } from '@namnam/database';

@Module({
  imports: [DatabaseModule],
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
