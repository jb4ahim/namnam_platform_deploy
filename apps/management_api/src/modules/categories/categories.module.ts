import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './categories.repository';
import {  StorageModule } from '@app/storage';

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
  exports: [CategoriesService]
})
export class CategoriesModule {}


