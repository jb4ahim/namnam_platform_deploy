import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core/constants';

import { AuthModule } from './modules/auth/auth.module';
import { LoggerModule } from '@app/common';
import { GlobalExceptionFilter } from '@app/common';
import { ResponseEnvelopeInterceptor } from '@app/common';
import { MerchantModule } from './modules/merchant/merchant.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@app/auth/jwt.module';
import { UploadsModule } from '@app/common/uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    JwtModule,
    LoggerModule,
    AuthModule,
    MerchantModule,
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
    }
  ]
})
export class AppModule {}