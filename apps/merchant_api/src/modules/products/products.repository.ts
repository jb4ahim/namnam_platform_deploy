import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsRepository {
  constructor(private readonly pg: PostgresService) {}

  async getProducts(merchantId: number, sectionId?: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_merchant_products',
      [merchantId, sectionId || null]
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
        productDto.price || null,
        JSON.stringify(productDto.categoryIds || []),
        JSON.stringify(productDto.variations || []),
        JSON.stringify(productDto.groupChoices || [])
      ]
    );
    console.log('updateProduct result:', result);
    return result;
  }

  async deleteProduct(productId: number, merchantId: number) {
    console.log('Deleting product for merchantId:', merchantId, 'productId:', productId);
     await DatabaseUtils.callProcedure(
      this.pg,
      'delete_product_merchant',
      [productId, merchantId]
    );
  }

  async getProductById(productId: number, merchantId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_merchant_product_by_id',
      [ merchantId, productId],
      false
    );
    return result;
  }

  async changeProductStatus(productId: number, isDisabled: boolean, merchantId: number) {
        await DatabaseUtils.callProcedure(
            this.pg,
            'update_product_disabled_status',
            [productId, merchantId, isDisabled]
        );
    }
}