import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from '@app/storage';
import { UploadsController } from './uploads.controller';

@Module({
  imports: [ConfigModule, StorageModule],
  controllers: [UploadsController],
})
export class UploadsModule {}


