import { Injectable, Logger } from '@nestjs/common';
import { PostgresService } from './postgres.service';

export type AnalyticsEntityType = 'product' | 'restaurant';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly pg: PostgresService) {}

  trackView(entityType: AnalyticsEntityType, entityId: number, userId: number): void {
    console.log(`Tracking view: ${entityType} #${entityId} by user #${userId}`);

    // $1::entity_type cast is required because node-postgres sends JS strings as
    // PostgreSQL TEXT, and PG won't implicitly cast TEXT → custom enum in CALL statements.
    this.pg
      .query('CALL insert_analytics_view($1::entity_type, $2, $3)', [entityType, entityId, userId])
      .then(() => {
        console.log(`View tracked: ${entityType} #${entityId}`);
      })
      .catch((err) => {
        // Log the error but never throw — analytics must never break the main response
        this.logger.warn(`Failed to track view (${entityType} #${entityId}): ${err.message}`);
      });
  }
}
