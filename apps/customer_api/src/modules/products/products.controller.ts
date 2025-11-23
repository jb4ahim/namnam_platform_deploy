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
  async getProductById(@Param('id', ParseIntPipe) productId: number) {
    return await this.productsService.getProductById(productId);
  }
}
