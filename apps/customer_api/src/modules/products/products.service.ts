import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { resolveS3Urls, S3PresignService } from '@app/storage';
import { ProductsRepository } from './products.repository';
import {
    GetProductDto,
    GetProductImageDto,
    GetProductMerchantDto,
} from './dto/get-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        private readonly repo: ProductsRepository,
        private readonly s3Service: S3PresignService,
    ) {}

    async getProducts(merchantId: number, filters?: {
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    isAvailable?: boolean;
    hasDiscount?: boolean;
    limit?: number;
  }) {
        return this.repo.getProducts(merchantId, filters);
    }

    async getProductById(productId: number, userId: number) {
        const product = await this.repo.getProductById(productId, userId);
        if (!product) {
            return product;
        }

        const productDto = plainToInstance(GetProductDto, product);

        if (productDto.merchant) {
            const merchantDto = await resolveS3Urls(
                plainToInstance(GetProductMerchantDto, productDto.merchant),
                this.s3Service,
            );
            merchantDto.logoKey = undefined;
            productDto.merchant = merchantDto;
        }

        if (Array.isArray(productDto.images)) {
            productDto.images = await Promise.all(
                productDto.images.map(async (image) => {
                    const imageDto = await resolveS3Urls(
                        plainToInstance(GetProductImageDto, image),
                        this.s3Service,
                    );
                    imageDto.imageKey = undefined;
                    return imageDto;
                }),
            );
        }

        return productDto;
    }
}
