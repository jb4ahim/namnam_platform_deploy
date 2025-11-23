import { Injectable } from '@nestjs/common';
import { SearchRepository } from './search.repository';

@Injectable()
export class SearchService {
  constructor(private readonly repo: SearchRepository) {}

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
    return this.repo.unifiedSearch(query, type, categoryId, zoneId, latitude, longitude, limit, offset);
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
    return this.repo.searchProducts(query, merchantId, categoryId, minPrice, maxPrice, limit, offset);
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
    return this.repo.searchMerchants(query, categoryId, zoneId, latitude, longitude, limit, offset);
  }

  async getSuggestions(query: string, type?: 'products' | 'merchants', limit?: number) {
    return this.repo.getSuggestions(query, type, limit);
  }
}
