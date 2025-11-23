import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';

@Injectable()
export class SearchRepository {
  constructor(private readonly pg: PostgresService) {}

  async unifiedSearch(
    query: string,
    type?: 'products' | 'merchants',
    categoryId?: number,
    zoneId?: number,
    latitude?: number,
    longitude?: number,
    limit?: number,
    offset?: number
  ) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'unified_search',
      [
        query,
        type || null,
        categoryId || null,
        zoneId || null,
        latitude || null,
        longitude || null,
        limit || 20,
        offset || 0,
      ],
      false
    );
    return result;
  }

  async searchProducts(
    query: string,
    merchantId?: number,
    categoryId?: number,
    minPrice?: number,
    maxPrice?: number,
    limit?: number,
    offset?: number
  ) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'search_products',
      [
        query,
        merchantId || null,
        categoryId || null,
        minPrice || null,
        maxPrice || null,
        limit || 20,
        offset || 0,
      ],
      false
    );
    return result;
  }

  async searchMerchants(
    query: string,
    categoryId?: number,
    zoneId?: number,
    latitude?: number,
    longitude?: number,
    limit?: number,
    offset?: number
  ) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'search_merchants',
      [
        query,
        categoryId || null,
        zoneId || null,
        latitude || null,
        longitude || null,
        limit || 20,
        offset || 0,
      ],
      false
    );
    return result;
  }

  async getSuggestions(query: string, type?: 'products' | 'merchants', limit?: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'search_suggestions',
      [query, type || null, limit || 10],
      false
    );
    return result;
  }
}
