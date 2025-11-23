import { Controller, Get, Query, ParseIntPipe, ParseFloatPipe } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async unifiedSearch(
    @Query('q') query: string,
    @Query('type') type?: 'products' | 'merchants',
    @Query('categoryId', ParseIntPipe) categoryId?: number,
    @Query('zoneId', ParseIntPipe) zoneId?: number,
    @Query('latitude', ParseFloatPipe) latitude?: number,
    @Query('longitude', ParseFloatPipe) longitude?: number,
    @Query('limit', ParseIntPipe) limit?: number,
    @Query('offset', ParseIntPipe) offset?: number,
  ) {
    return await this.searchService.unifiedSearch(
      query,
      type,
      categoryId,
      zoneId,
      latitude,
      longitude,
      limit,
      offset
    );
  }

  @Get('products')
  async searchProducts(
    @Query('q') query: string,
    @Query('merchantId', ParseIntPipe) merchantId?: number,
    @Query('categoryId', ParseIntPipe) categoryId?: number,
    @Query('minPrice', ParseFloatPipe) minPrice?: number,
    @Query('maxPrice', ParseFloatPipe) maxPrice?: number,
    @Query('limit', ParseIntPipe) limit?: number,
    @Query('offset', ParseIntPipe) offset?: number,
  ) {
    return await this.searchService.searchProducts(
      query,
      merchantId,
      categoryId,
      minPrice,
      maxPrice,
      limit,
      offset
    );
  }

  @Get('merchants')
  async searchMerchants(
    @Query('q') query: string,
    @Query('categoryId', ParseIntPipe) categoryId?: number,
    @Query('zoneId', ParseIntPipe) zoneId?: number,
    @Query('latitude', ParseFloatPipe) latitude?: number,
    @Query('longitude', ParseFloatPipe) longitude?: number,
    @Query('limit', ParseIntPipe) limit?: number,
    @Query('offset', ParseIntPipe) offset?: number,
  ) {
    return await this.searchService.searchMerchants(
      query,
      categoryId,
      zoneId,
      latitude,
      longitude,
      limit,
      offset
    );
  }

  @Get('suggestions')
  async getSuggestions(
    @Query('q') query: string,
    @Query('type') type?: 'products' | 'merchants',
    @Query('limit', ParseIntPipe) limit?: number,
  ) {
    return await this.searchService.getSuggestions(query, type, limit);
  }
}
