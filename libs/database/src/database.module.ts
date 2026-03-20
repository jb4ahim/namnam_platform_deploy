import { Module } from '@nestjs/common';
import { PostgresService } from './postgres.service';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PostgresService, AnalyticsService, PrismaService],
  exports: [PostgresService, AnalyticsService, PrismaService],
})
export class DatabaseModule {}
