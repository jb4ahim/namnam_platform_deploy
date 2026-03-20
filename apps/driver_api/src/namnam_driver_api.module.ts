import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { GlobalExceptionFilter, LoggerModule, ResponseEnvelopeInterceptor } from '@app/common';
import { JwtModule } from '@app/auth/jwt.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AvailabilityModule } from './modules/availability/availability.module';
import { EarningsModule } from './modules/earnings/earnings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    JwtModule,
    DatabaseModule,
    LoggerModule,
    AuthModule,
    ProfileModule,
    OrdersModule,
    AvailabilityModule,
    EarningsModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseEnvelopeInterceptor },
  ],
})
export class NamnamDriverApiModule {}
