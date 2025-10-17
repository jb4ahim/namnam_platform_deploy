import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';

@Injectable()
export class ProductsRepository {
  constructor(private readonly pg: PostgresService) {}

  async getProducts(merchantId?: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_products_customer',
      merchantId ? [merchantId] : [],
      true
    );
    return result || [];
  }

  async getProductById(productId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_product_by_id_customer',
      [productId],
      false
    );
    return result;
  }
}
