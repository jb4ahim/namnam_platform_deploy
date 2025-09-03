import { Controller, Get, Post, Put, Body, Param, ParseIntPipe, UseGuards, Req, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@app/auth';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  // Section endpoints
  @Get('sections')
  @UseGuards(AuthGuard)
  async getSections(@Req() req: any) {
    const merchantId = req.user.userId.userId;
    return await this.catalogService.getSections(merchantId);
  }

  @Post('sections')
  @UseGuards(AuthGuard)
  async createSection(@Body() createSectionDto: CreateSectionDto, @Req() req: any) {
    const merchantId = req.user.userId.userId;
    return await this.catalogService.createSection(createSectionDto, merchantId);
  }

  @Put('sections/:id')
  @UseGuards(AuthGuard)
  async updateSection(
    @Param('id', ParseIntPipe) sectionId: number,
    @Body() updateSectionDto: UpdateSectionDto,
    @Req() req: any
  ) {
    const merchantId = req.user.userId.userId;
    return await this.catalogService.updateSection(sectionId, updateSectionDto, merchantId);
  }

  // Product endpoints
  @Get('products')
  @UseGuards(AuthGuard)
  async getProducts(@Req() req: any, @Query('sectionId', ParseIntPipe) sectionId?: number) {
    const merchantId = req.user.userId.userId;
    return await this.catalogService.getProducts(merchantId, sectionId);
  }

  @Post('products')
  @UseGuards(AuthGuard)
  async createProduct(@Body() createProductDto: CreateProductDto, @Req() req: any) {
    const merchantId = req.user.userId.userId;
    return await this.catalogService.createProduct(createProductDto, merchantId);
  }

  @Put('products/:id')
  @UseGuards(AuthGuard)
  async updateProduct(
    @Param('id', ParseIntPipe) productId: number,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: any
  ) {
    const merchantId = req.user.userId.userId;
    return await this.catalogService.updateProduct(productId, updateProductDto, merchantId);
  }
}
