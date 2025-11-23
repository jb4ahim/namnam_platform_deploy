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
import { FavoritesModule } from './modules/favorites/favorites.module'; // Import the FavoritesModule
import { ReviewsModule } from './modules/reviews/reviews.module'; // Import the ReviewsModule
import { ProfileModule } from './modules/profile/profile.module'; // Import the ProfileModule
import { NotificationsModule } from './modules/notifications/notifications.module'; // Import the NotificationsModule
import { SearchModule } from './modules/search/search.module'; // Import the SearchModule

@Module({
  imports: [
    ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env'
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
    OrdersModule,
    FavoritesModule,
    ReviewsModule,
    ProfileModule,
    NotificationsModule, // Add this line
    SearchModule, // Add this line
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
