import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async getProducts(merchantId: number, sectionId?: number) {
    try {
      return await this.productsRepository.getProducts(merchantId, sectionId);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new BadRequestException('Failed to fetch products');
    }
  }

  async getProductById(productId: number, merchantId: number) {
    try {
      const product = await this.productsRepository.getProductById(productId, merchantId);
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching product:', error);
      throw new BadRequestException('Failed to fetch product');
    }
  }

  async createProduct(createProductDto: CreateProductDto, merchantId: number) {
    try {
      const result = await this.productsRepository.createProduct(createProductDto, merchantId);
      if (!result) {
        throw new BadRequestException('Failed to create product');
      }
      return {
        success: true,
        message: 'Product created successfully',
        data: result
      };
    } catch (error) {
      console.error('Error creating product:', error);
      throw new BadRequestException('Failed to create product');
    }
  }

  async updateProduct(productId: number, updateProductDto: UpdateProductDto, merchantId: number) {
    try {
      const result = await this.productsRepository.updateProduct(productId, updateProductDto, merchantId);
      if (!result) {
        throw new BadRequestException('Failed to update product');
      }
      return {
        success: true,
        message: 'Product updated successfully',
        data: result
      };
    } catch (error) {
      console.error('Error updating product:', error);
      throw new BadRequestException('Failed to update product');
    }
  }

  async deleteProduct(productId: number, merchantId: number) {
      const result = await this.productsRepository.deleteProduct(productId, merchantId);
  }
  async changeProductStatus(productId: number, isDisabled: boolean, merchantId: number) {
       await this.productsRepository.changeProductStatus(productId, isDisabled, merchantId);

}
}