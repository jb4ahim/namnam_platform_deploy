import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { MerchantsController } from './merchants.controller';
import { MerchantsService } from './merchants.service';
import { MerchantsRepository } from './merchants.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [MerchantsController],
  providers: [MerchantsService, MerchantsRepository],
  exports: [MerchantsService],
})
export class MerchantsModule {}
