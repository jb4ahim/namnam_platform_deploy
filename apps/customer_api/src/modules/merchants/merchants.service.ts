import { Injectable } from '@nestjs/common';
import { MerchantsRepository } from './merchants.repository';

@Injectable()
export class MerchantsService {
  constructor(private readonly repo: MerchantsRepository) {}

  async getMerchants(categoryId?: number, latitude?: number, longitude?: number) {
    return this.repo.getMerchants(categoryId, latitude, longitude);
  }

  async getMerchantById(merchantId: number) {
    return this.repo.getMerchantById(merchantId);
  }
}
