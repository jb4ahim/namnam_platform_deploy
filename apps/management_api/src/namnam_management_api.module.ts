import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { LoggerModule } from '@app/common';
import { GlobalExceptionFilter } from '@app/common';
import { ResponseEnvelopeInterceptor } from '@app/common';
import { UsersModule } from './modules/users/users.module';
import { UploadsModule } from '@app/common/uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true
    }),
    LoggerModule,
    AuthModule,
    CategoriesModule,
    UsersModule,
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
export class NamnamManagementApiModule {}
