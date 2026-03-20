import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { EarningsController } from './earnings.controller';
import { EarningsService } from './earnings.service';
import { EarningsRepository } from './earnings.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [EarningsController],
  providers: [EarningsService, EarningsRepository],
})
export class EarningsModule {}
