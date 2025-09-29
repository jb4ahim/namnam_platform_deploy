import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { LoggerModule } from '@app/common';
import { GlobalExceptionFilter } from '@app/common';
import { ResponseEnvelopeInterceptor } from '@app/common';
import { UsersModule } from './modules/users/users.module';
import { MerchantModule } from './modules/merchant/merchant.module';
import { UploadsModule } from '@app/common/uploads/uploads.module';
import { ZonesModule } from './modules/zones/zones.module';
import { NotificationModule } from '@app/notifications';

@Module({
  imports: [
    ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env'
    }),
    LoggerModule,
    AuthModule,
    CategoriesModule,
    UsersModule,
    MerchantModule,
    UploadsModule,
    ZonesModule
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
export class NamnamManagementApiModule {}
