import { Module } from '@nestjs/common';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';
import { DatabaseModule } from '@app/database/database.module';
import { AuthModule } from '../auth/auth.module';
import { MerchantRepository } from './merchant.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ DatabaseModule, JwtModule],
  controllers: [MerchantController],
  providers: [MerchantService, MerchantRepository],
  exports: [MerchantService]
})
export class MerchantModule {}
