import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly repo: ProductsRepository) {}

  async getProducts(merchantId?: number) {
    return this.repo.getProducts(merchantId);
  }

  async getProductById(productId: number) {
    return this.repo.getProductById(productId);
  }
}
