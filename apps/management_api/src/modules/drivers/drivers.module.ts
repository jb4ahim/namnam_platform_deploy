import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { DriversRepository } from './drivers.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [DriversController],
  providers: [DriversService, DriversRepository],
})
export class DriversModule {}
