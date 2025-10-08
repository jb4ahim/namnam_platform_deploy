import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { StorageModule } from '@app/storage';
import { PromotionsController } from './promotions.controller';
import { PromotionsService } from './promotions.service';
import { PromotionsRepository } from './promotions.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, StorageModule, JwtModule],
  controllers: [PromotionsController],
  providers: [PromotionsService, PromotionsRepository],
  exports: [PromotionsService],
})
export class PromotionsModule {}
