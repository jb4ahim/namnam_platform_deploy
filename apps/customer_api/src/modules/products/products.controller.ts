import { Controller, Get, Param, ParseFloatPipe, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@app/auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getProducts(
    @Query('merchantId', ParseIntPipe) merchantId: number,
    @Query('categoryId', ParseIntPipe) categoryId?: number,
    @Query('minPrice', ParseFloatPipe) minPrice?: number,
    @Query('maxPrice', ParseFloatPipe) maxPrice?: number,
    @Query('isAvailable') isAvailable?: boolean,
    @Query('hasDiscount') hasDiscount?: boolean,
    @Query('limit', ParseIntPipe) limit?: number,
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
  async getProductById(@Param('id', ParseIntPipe) productId: number) {
    return await this.productsService.getProductById(productId);
  }
}
