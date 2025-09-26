import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards, Query, Patch } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@app/auth';
import { CurrentUserId } from '@app/common/decorators/current-user-id.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getProducts(
    @CurrentUserId() merchantId: number, 
    @Query('sectionId', ParseIntPipe) sectionId?: number
  ) {
    return await this.productsService.getProducts(merchantId, sectionId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getProductById(
    @Param('id', ParseIntPipe) productId: number,
    @CurrentUserId() merchantId: number
  ) {
    return await this.productsService.getProductById(productId, merchantId);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createProduct(
    @Body() createProductDto: CreateProductDto, 
    @CurrentUserId() merchantId: number
  ) {
    return await this.productsService.createProduct(createProductDto, merchantId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateProduct(
    @Param('id', ParseIntPipe) productId: number,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUserId() merchantId: number
  ) {
    return await this.productsService.updateProduct(productId, updateProductDto, merchantId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteProduct(
    @Param('id', ParseIntPipe) productId: number,
    @CurrentUserId() merchantId: number
  ) {
    return await this.productsService.deleteProduct(productId, merchantId);
  }

@Patch(':id/change-status')
async changeProductStatus(
  @Param('id', ParseIntPipe) productId: number,
  @Body('isDisabled') isDisabled: boolean,
  @CurrentUserId() merchantId: number
) {
  return await this.productsService.changeProductStatus(productId, isDisabled, merchantId);
}
}