import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';
import { MerchantRepository } from './merchant.repository';
import { JwtModule } from '@nestjs/jwt';
import { StorageModule } from '@app/storage';
import { NotificationModule } from '@app/notifications/notification.module';

@Module({
  imports: [ DatabaseModule, JwtModule, StorageModule,  NotificationModule],
  controllers: [MerchantController],
  providers: [MerchantService, MerchantRepository],
  exports: [MerchantService],
})
export class MerchantModule {}