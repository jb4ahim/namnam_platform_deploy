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
import { AppConfigModule } from './modules/app-config/app-config.module';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { MerchantsModule } from './modules/merchants/merchants.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from 'apps/management_api/src/modules/categories/categories.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';

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
    AddressModule,
    AppConfigModule,
    MerchantsModule,
    ProductsModule,
    PromotionsModule,
    CategoriesModule,
    CartModule,
    OrdersModule
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
