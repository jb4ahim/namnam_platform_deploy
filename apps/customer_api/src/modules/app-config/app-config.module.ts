import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { AppConfigController } from './app-config.controller';
import { AppConfigService } from './app-config.service';
import { AppConfigRepository } from './app-config.repository';
import { CategoriesModule } from '../categories/categories.module';
import { StorageModule } from '@app/storage';

@Module({
  imports: [DatabaseModule, CategoriesModule, StorageModule],
  controllers: [AppConfigController],
  providers: [AppConfigService, AppConfigRepository],
  exports: [AppConfigService],
})
export class AppConfigModule {}
