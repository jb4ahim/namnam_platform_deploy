import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class CatalogRepository {
  constructor(private readonly pg: PostgresService) {}

  // Section methods
  async getSections(merchantId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_catalog_sections',
      [merchantId],
      true
    );
    return result || [];
  }

  async createSection(sectionDto: CreateSectionDto, merchantId: number) {
    console.log('Creating section for merchantId:', merchantId);
    const result = await DatabaseUtils.callProcedure(
      this.pg,
      'insert_catalog_section',
      [
        merchantId,
        sectionDto.sectionTitleArabic,
        sectionDto.sectionTitleEnglish,
        null
      ]
    );
    console.log('createSection result:', result);
    return result;
  }

  async updateSection(sectionId: number, sectionDto: UpdateSectionDto, merchantId: number): Promise<void> {
    console.log('Updating section for merchantId:', merchantId, 'sectionId:', sectionId);
    await DatabaseUtils.callProcedure(
      this.pg,
      'update_merchant_section',
      [
        sectionId,
        merchantId,
        sectionDto.sectionTitleArabic || null,
        sectionDto.sectionTitleEnglish || null
      ]
    );
  }

  // Product methods
  async getProducts(merchantId: number, sectionId?: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_merchant_products',
      [merchantId, sectionId || null],
      true
    );
    return result || [];
  }

  async createProduct(productDto: CreateProductDto, merchantId: number) {
    console.log('Creating product for merchantId:', merchantId);
    const result = await DatabaseUtils.callProcedure(
      this.pg,
      'insert_merchant_product',
      [
        merchantId,
        productDto.sectionId,
        JSON.stringify(productDto.imageKeys),
        productDto.productNameArabic,
        productDto.productNameEnglish,
        productDto.productDescriptionArabic || null,
        productDto.productDescriptionEnglish || null,
        productDto.price,
        JSON.stringify(productDto.categoryIds),
        null,
        JSON.stringify(productDto.variations || []),
        JSON.stringify(productDto.groupChoices || [])
      ]
    );
    console.log('createProduct result:', result);
    return result;
  }

  async updateProduct(productId: number, productDto: UpdateProductDto, merchantId: number) {
    console.log('Updating product for merchantId:', merchantId, 'productId:', productId);
    const result = await DatabaseUtils.callProcedure(
      this.pg,
      'update_merchant_product',
      [
        productId,
        merchantId,
        productDto.sectionId || null,
        productDto.imageKeys ? JSON.stringify(productDto.imageKeys) : null,
        productDto.productNameArabic || null,
        productDto.productNameEnglish || null,
        productDto.productDescriptionArabic || null,
        productDto.productDescriptionEnglish || null,
       JSON.stringify(productDto.categoryIds),
       JSON.stringify(productDto.variations || []),
       JSON.stringify(productDto.groupChoices || [])
      ]
    );
    console.log('updateProduct result:', result);
    return result;
  }
}
