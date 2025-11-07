import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';
import { CouponsRepository } from './coupons.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, JwtModule],
  controllers: [CouponsController],
  providers: [CouponsService, CouponsRepository],
  exports: [CouponsService],
})
export class CouponsModule {}
