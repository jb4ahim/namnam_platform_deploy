import { S3Url } from '@app/storage';

export class GetProductImageDto {
  imageId: number;
  imageKey?: string;

  @S3Url()
  imageUrl?: string;

  position?: number;
}

export class GetProductMerchantDto {
  merchantId: number;
  name: string;
  logoKey?: string;

  @S3Url()
  logoUrl?: string;
}

export class GetProductDto {
  productId: number;
  nameAr?: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  price?: number;
  salePrice?: number | null;
  discountPercentage?: number | null;
  sectionId?: number;
  images?: GetProductImageDto[];
  merchant?: GetProductMerchantDto;
  categories?: unknown[];
  variations?: unknown;
  groupChoices?: unknown[];
}
