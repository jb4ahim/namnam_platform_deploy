import { Injectable } from '@nestjs/common';
import { AnalyticsService, DatabaseUtils, PostgresService } from '@app/database';

@Injectable()
export class MerchantsRepository {
  constructor(
    private readonly pg: PostgresService,
    private readonly analytics: AnalyticsService,
  ) {}

    async getMerchants(filters?: {
        latitude?: number;
        longitude?: number;
        categoryId?: number;
        zoneId?: number;
        limit?: number;
    }) {
        const result = await DatabaseUtils.callFunction(
            this.pg,
            'select_merchants_customer',
            [
                null, // p_manual_ids - null for filter mode
                filters?.latitude || null,
                filters?.longitude || null,
                filters?.categoryId || null,
                filters?.zoneId || null,
                filters?.limit || 50,
            ],
            false
        );
        return result || [];
    }

    async getMerchantById(merchantId: number, userId: number) {
        const result = await DatabaseUtils.callFunction(
        this.pg,
        'select_merchant_by_id_customer',
        [merchantId],
        false
        );
        this.analytics.trackView('restaurant', merchantId, userId);
        return result;
    }
}
