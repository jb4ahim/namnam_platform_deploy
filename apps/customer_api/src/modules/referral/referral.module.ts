import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { ReferralService } from './referral.service';

@Module({
  imports: [DatabaseModule],
  providers: [ReferralService],
  exports: [ReferralService],
})
export class ReferralModule {}
