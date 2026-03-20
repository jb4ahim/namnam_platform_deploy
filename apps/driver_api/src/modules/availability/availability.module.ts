import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';
import { AvailabilityRepository } from './availability.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [AvailabilityController],
  providers: [AvailabilityService, AvailabilityRepository],
})
export class AvailabilityModule {}
