import { Injectable } from '@nestjs/common';
import { MerchantsRepository } from './merchants.repository';

@Injectable()
export class MerchantsService {
    constructor(private readonly repo: MerchantsRepository) {}

    async getMerchants(filters?: {
    latitude?: number;
    longitude?: number;
    categoryId?: number;
    zoneId?: number;
    minRating?: number;
    isOpen?: boolean;
    hasDiscount?: boolean;
    limit?: number;
  }) {
        return this.repo.getMerchants(filters);
    }

    async getMerchantById(merchantId: number) {
        return this.repo.getMerchantById(merchantId);
    }
}
