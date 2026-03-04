import { Controller, Get, Param, ParseFloatPipe, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { AuthGuard } from '@app/auth/jwt-auth.guard';
import { CurrentUserId } from '@app/common/decorators';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of products' })
  @ApiQuery({ name: 'merchantId', required: true, type: Number })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'isAvailable', required: false, type: Boolean })
  @ApiQuery({ name: 'hasDiscount', required: false, type: Boolean })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Return paginated products list.' })
  async getProducts(
    @Query('merchantId', ParseIntPipe) merchantId: number,
    @Query('categoryId', new ParseIntPipe({ optional: true })) categoryId?: number,
    @Query('minPrice', new ParseFloatPipe({ optional: true })) minPrice?: number,
    @Query('maxPrice', new ParseFloatPipe({ optional: true })) maxPrice?: number,
    @Query('isAvailable') isAvailable?: boolean,
    @Query('hasDiscount') hasDiscount?: boolean,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return await this.productsService.getProducts(merchantId, {
      categoryId,
      minPrice,
      maxPrice,
      isAvailable,
      hasDiscount,
      limit,
    });
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get product details by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Return product details.' })
  async getProductById(
    @Param('id', ParseIntPipe) productId: number,
    @CurrentUserId() userId: number,
  ) {
    return await this.productsService.getProductById(productId, userId);
  }
}
