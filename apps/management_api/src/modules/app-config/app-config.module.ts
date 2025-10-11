import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigController } from './app-config.controller';
import { AppConfigService } from './app-config.service';
import { AppConfigRepository } from './app-config.repository';

@Module({
  imports: [DatabaseModule, JwtModule],
  controllers: [AppConfigController],
  providers: [AppConfigService, AppConfigRepository],
  exports: [AppConfigService],
})
export class AppConfigModule {}
