import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { GlobalExceptionFilter } from '@app/common';
import { LoggerModule } from '@app/common';
import { ResponseEnvelopeInterceptor } from '@app/common';
import { UploadsModule } from '@app/common/uploads/uploads.module';
import { AddressModule } from './modules/address/address.module';
import { JwtModule } from '@app/auth/jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env', // This will load from root
    }),
    JwtModule,
    DatabaseModule, 
    AuthModule, 
    LoggerModule,
    UploadsModule,
    AddressModule
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
