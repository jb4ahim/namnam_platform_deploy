import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';

@Injectable()
export class MerchantsRepository {
    constructor(private readonly pg: PostgresService) {}

    async getMerchants(categoryId?: number, latitude?: number, longitude?: number) {
        const result = await DatabaseUtils.callFunction(
            this.pg,
            'select_merchants_customer',
            [null, null, null,  null],
            false
        );
        return result || [];
    }

    async getMerchantById(merchantId: number) {
        const result = await DatabaseUtils.callFunction(
        this.pg,
        'select_merchant_by_id_customer',
        [merchantId],
        false
        );
        return result;
    }
}