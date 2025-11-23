import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ProfileRepository } from './profile.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, JwtModule],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository],
  exports: [ProfileService],
})
export class ProfileModule {}
