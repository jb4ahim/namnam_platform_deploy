import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
    constructor(private readonly repo: ProductsRepository) {}

    async getProducts(merchantId: number, filters?: {
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    isAvailable?: boolean;
    hasDiscount?: boolean;
    limit?: number;
  }) {
        return this.repo.getProducts(merchantId, filters);
    }

    async getProductById(productId: number, userId: number) {
        return this.repo.getProductById(productId, userId);
    }
}
