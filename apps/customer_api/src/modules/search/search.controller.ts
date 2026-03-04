import { Controller, Get, Query, ParseIntPipe, ParseFloatPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Unified search across products and merchants' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'type', required: false, enum: ['products', 'merchants'] })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'zoneId', required: false, type: Number })
  @ApiQuery({ name: 'latitude', required: false, type: Number })
  @ApiQuery({ name: 'longitude', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Return combined search results.' })
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
  @ApiOperation({ summary: 'Search for products only' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'merchantId', required: false, type: Number })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Return paginated products.' })
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
  @ApiOperation({ summary: 'Search for merchants only' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'zoneId', required: false, type: Number })
  @ApiQuery({ name: 'latitude', required: false, type: Number })
  @ApiQuery({ name: 'longitude', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Return paginated merchants.' })
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
  @ApiOperation({ summary: 'Get search autocomplete suggestions' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'type', required: false, enum: ['products', 'merchants'] })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Return suggestions.' })
  async getSuggestions(
    @Query('q') query: string,
    @Query('type') type?: 'products' | 'merchants',
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return await this.searchService.getSuggestions(query, type, limit);
  }
}
