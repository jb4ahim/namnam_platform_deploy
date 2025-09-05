import { Module } from '@nestjs/common';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';
import { DatabaseModule } from '@app/database/database.module';
import { MerchantRepository } from './merchant.repository';
import { JwtModule } from '@nestjs/jwt';
import { StorageModule } from '@app/storage';

@Module({
  imports: [ DatabaseModule, JwtModule, StorageModule],
  controllers: [MerchantController],
  providers: [MerchantService, MerchantRepository],
  exports: [MerchantService]
})
export class MerchantModule {}
