import { Injectable } from '@nestjs/common';
import { AnalyticsService, DatabaseUtils, PostgresService } from '@app/database';

@Injectable()
export class ProductsRepository {
  constructor(
    private readonly pg: PostgresService,
    private readonly analytics: AnalyticsService,
  ) {}

  async getProducts(merchantId: number, filters?: {
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    isAvailable?: boolean;
    hasDiscount?: boolean;
    limit?: number;
  }) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_products_customer',
      [
        merchantId,
        null, // p_manual_ids - null for filter mode
        filters?.categoryId || null,
        filters?.minPrice || null,
        filters?.maxPrice || null,
        filters?.isAvailable ?? true,
        filters?.hasDiscount ?? null,
        filters?.limit || null,
      ],
      false
    );
    return result || [];
  }

  async getProductById(productId: number, userId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_product_by_id_customer',
      [productId],
      false
    );
    this.analytics.trackView('product', productId, userId);
    return result;
  }
}
