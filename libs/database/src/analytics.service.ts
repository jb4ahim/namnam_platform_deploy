import { Injectable } from '@nestjs/common';
import { PostgresService } from './postgres.service';
import { DatabaseUtils } from './database.utils';

export type AnalyticsEntityType = 'product' | 'restaurant';

@Injectable()
export class AnalyticsService {
  constructor(private readonly pg: PostgresService) {}

  trackView(entityType: AnalyticsEntityType, entityId: number, userId: number): void {
    DatabaseUtils.callProcedure(this.pg, 'insert_analytics_view', [entityType, entityId, userId])
      .catch(() => {}); // fire-and-forget: analytics must never break the main response
  }
}
