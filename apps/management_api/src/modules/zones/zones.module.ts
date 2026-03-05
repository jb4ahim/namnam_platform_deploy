import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { ZonesController } from './zones.controller';
import { ZonesService } from './zones.service';
import { ZonesRepository } from './zones.repository';
import { JwtModule } from '@app/auth/jwt.module';

@Module({
  imports: [DatabaseModule, JwtModule],
  controllers: [ZonesController],
  providers: [ZonesService, ZonesRepository],
  exports: [ZonesService, ZonesRepository],
})
export class ZonesModule {}
