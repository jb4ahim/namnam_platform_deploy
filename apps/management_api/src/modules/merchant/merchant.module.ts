import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';
import { MerchantRepository } from './merchant.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ DatabaseModule, JwtModule],
  controllers: [MerchantController],
  providers: [MerchantService, MerchantRepository],
  exports: [MerchantService],
})
export class MerchantModule {}