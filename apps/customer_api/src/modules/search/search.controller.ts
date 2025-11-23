import { Controller, Get, Query, ParseIntPipe, ParseFloatPipe } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async unifiedSearch(
    @Query('q') query: string,
    @Query('type') type?: 'products' | 'merchants',
    @Query('categoryId', new ParseIntPipe({ optional: true })) categoryId?: number,
    @Query('zoneId', new ParseIntPipe({ optional: true })) zoneId?: number,
    @Query('latitude', new ParseFloatPipe({ optional: true })) latitude?: number,
    @Query('longitude', new ParseFloatPipe({ optional: true })) longitude?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
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
    @Query('merchantId', new ParseIntPipe({ optional: true })) merchantId?: number,
    @Query('categoryId', new ParseIntPipe({ optional: true })) categoryId?: number,
    @Query('minPrice', new ParseFloatPipe({ optional: true })) minPrice?: number,
    @Query('maxPrice', new ParseFloatPipe({ optional: true })) maxPrice?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
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
    @Query('categoryId', new ParseIntPipe({ optional: true })) categoryId?: number,
    @Query('zoneId', new ParseIntPipe({ optional: true })) zoneId?: number,
    @Query('latitude', new ParseFloatPipe({ optional: true })) latitude?: number,
    @Query('longitude', new ParseFloatPipe({ optional: true })) longitude?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
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
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return await this.searchService.getSuggestions(query, type, limit);
  }
}
