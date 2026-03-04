import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@app/auth';
import { CurrentUserId } from '@app/common/decorators/current-user-id.decorator';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ name: 'sectionId', required: false, type: Number, description: 'Filter by section ID' })
  async getProducts(
    @CurrentUserId() merchantId: number, 
    @Query('sectionId', ParseIntPipe) sectionId?: number
  ) {
    return await this.productsService.getProducts(merchantId, sectionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  async getProductById(
    @Param('id', ParseIntPipe) productId: number,
    @CurrentUserId() merchantId: number
  ) {
    return await this.productsService.getProductById(productId, merchantId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  async createProduct(
    @Body() createProductDto: CreateProductDto, 
    @CurrentUserId() merchantId: number
  ) {
    return await this.productsService.createProduct(createProductDto, merchantId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product' })
  async updateProduct(
    @Param('id', ParseIntPipe) productId: number,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUserId() merchantId: number
  ) {
    return await this.productsService.updateProduct(productId, updateProductDto, merchantId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  async deleteProduct(
    @Param('id', ParseIntPipe) productId: number,
    @CurrentUserId() merchantId: number
  ) {
    return await this.productsService.deleteProduct(productId, merchantId);
  }

@Patch(':id/change-status')
@ApiOperation({ summary: 'Enable or disable a product' })
@ApiBody({ schema: { properties: { isDisabled: { type: 'boolean' } }, required: ['isDisabled'] } })
async changeProductStatus(
  @Param('id', ParseIntPipe) productId: number,
  @Body('isDisabled') isDisabled: boolean,
  @CurrentUserId() merchantId: number
) {
  return await this.productsService.changeProductStatus(productId, isDisabled, merchantId);
}
}