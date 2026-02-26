import { Module } from '@nestjs/common';
import { PostgresService } from './postgres.service';
import { AnalyticsService } from './analytics.service';

@Module({
  providers: [PostgresService, AnalyticsService],
  exports: [PostgresService, AnalyticsService],
})
export class DatabaseModule {}
