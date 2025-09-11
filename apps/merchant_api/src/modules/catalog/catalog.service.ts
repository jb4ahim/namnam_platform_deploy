import { Injectable, BadRequestException } from '@nestjs/common';
import { CatalogRepository } from './catalog.repository';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class CatalogService {
  constructor(private readonly catalogRepository: CatalogRepository) {}

  // Section methods
  async getSections(merchantId: number) {
    return await this.catalogRepository.getSections(merchantId);
  }

  async createSection(createSectionDto: CreateSectionDto, merchantId: number) {
    try {
      const result = await this.catalogRepository.createSection(createSectionDto, merchantId);
      if (!result) {
        throw new BadRequestException('Failed to create section');
      }
      return {
        success: true,
        message: 'Section created successfully',
        data: result
      };
    } catch (error) {
      console.error('Error creating section:', error);
      throw new BadRequestException('Failed to create section');
    }
  }

  async updateSection(sectionId: number, updateSectionDto: UpdateSectionDto, merchantId: number) {
    try {
      await this.catalogRepository.updateSection(sectionId, updateSectionDto, merchantId);
      return {
        success: true,
        message: 'Section updated successfully'
      };
    } catch (error) {
      console.error('Error updating section:', error);
      throw new BadRequestException('Failed to update section');
    }
  }

  // Product methods
  async getProducts(merchantId: number, sectionId?: number) {
    return await this.catalogRepository.getProducts(merchantId, sectionId);
  }

  async createProduct(createProductDto: CreateProductDto, merchantId: number) {
    try {
      const result = await this.catalogRepository.createProduct(createProductDto, merchantId);
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
      const result = await this.catalogRepository.updateProduct(productId, updateProductDto, merchantId);
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
}
