import { S3Url } from '@app/storage';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetProductImageDto {
  @ApiProperty({ description: 'ID of the image', example: 101 })
  imageId: number;

  @ApiPropertyOptional({ description: 'S3 key of the image', example: 'products/1/image1.jpg' })
  imageKey?: string;

  @ApiPropertyOptional({ description: 'Full public URL of the image', example: 'https://s3.amazonaws.../image1.jpg' })
  @S3Url()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Sort position/order of the image', example: 1 })
  position?: number;
}

export class GetProductMerchantDto {
  @ApiProperty({ description: 'ID of the merchant', example: 50 })
  merchantId: number;

  @ApiProperty({ description: 'Name of the merchant', example: 'Super Store' })
  name: string;

  @ApiPropertyOptional({ description: 'S3 key of the merchant logo', example: 'merchants/logo.png' })
  logoKey?: string;

  @ApiPropertyOptional({ description: 'Full public URL of the logo', example: 'https://.../logo.png' })
  @S3Url()
  logoUrl?: string;
}

export class GetProductDto {
  @ApiProperty({ description: 'Product ID', example: 1 })
  productId: number;

  @ApiPropertyOptional({ description: 'Arabic name', example: 'منتج ممتاز' })
  nameAr?: string;

  @ApiPropertyOptional({ description: 'English name', example: 'Excellent Product' })
  nameEn?: string;

  @ApiPropertyOptional({ description: 'Arabic description', example: 'وصف المنتج...' })
  descriptionAr?: string;

  @ApiPropertyOptional({ description: 'English description', example: 'Product description...' })
  descriptionEn?: string;

  @ApiPropertyOptional({ description: 'Regular price of the product', example: 100 })
  price?: number;

  @ApiPropertyOptional({ description: 'Sale price if discounted', example: 80, nullable: true })
  salePrice?: number | null;

  @ApiPropertyOptional({ description: 'Percentage of discount', example: 20, nullable: true })
  discountPercentage?: number | null;

  @ApiPropertyOptional({ description: 'ID of the section this product belongs to', example: 5 })
  sectionId?: number;

  @ApiPropertyOptional({ type: [GetProductImageDto], description: 'List of product images' })
  images?: GetProductImageDto[];

  @ApiPropertyOptional({ type: GetProductMerchantDto, description: 'Merchant providing the product' })
  merchant?: GetProductMerchantDto;

  @ApiPropertyOptional({ type: [Object], description: 'Categories the product belongs to' })
  categories?: unknown[];

  @ApiPropertyOptional({ type: Object, description: 'Product variations like size, color, etc.' })
  variations?: unknown;

  @ApiPropertyOptional({ type: [Object], description: 'Choices or options for grouped products' })
  groupChoices?: unknown[];
}
