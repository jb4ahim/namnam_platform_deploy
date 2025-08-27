import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { ZonesController } from './zones.controller';
import { ZonesService } from './zones.service';
import { ZonesRepository } from './zones.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [ZonesController],
  providers: [ZonesService, ZonesRepository],
  exports: [ZonesService, ZonesRepository],
})
export class ZonesModule {}
