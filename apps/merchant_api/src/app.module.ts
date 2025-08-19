import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core/constants';

import { AuthModule } from './modules/auth/auth.module';
import { LoggerModule } from '@app/common';
import { GlobalExceptionFilter } from '@app/common';
import { ResponseEnvelopeInterceptor } from '@app/common';
import { MerchantModule } from './modules/merchant/merchant.module';

@Module({
  imports: [LoggerModule, AuthModule, MerchantModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseEnvelopeInterceptor
    }
  ]
})
export class AppModule {}