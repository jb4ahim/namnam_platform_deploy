import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductImageDto {
  @ApiProperty({ example: 1 })
  imageId: number;

  @ApiProperty({ example: 'products/burger-main.jpg' })
  imageKey: string;

  @ApiPropertyOptional({ example: 'https://s3.amazonaws.com/bucket/products/burger-main.jpg' })
  imageUrl?: string;

  @ApiProperty({ example: 1 })
  position: number;
}

export class ProductCategoryDto {
  @ApiProperty({ example: 14 })
  categoryId: number;

  @ApiProperty({ example: 'Burgers' })
  categoryName: string;
}

export class VariationOptionDto {
  @ApiProperty({ example: 1 })
  optionId: number;

  @ApiProperty({ example: 'Large' })
  name: string;

  @ApiProperty({ example: 'كبير' })
  nameAr: string;

  @ApiProperty({ example: 2.5 })
  price: number;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 1 })
  displayOrder: number;
}

export class ProductVariationDto {
  @ApiProperty({ example: 1 })
  variationId: number;

  @ApiProperty({ example: 'Size' })
  variationTitle: string;

  @ApiProperty({ example: 'الحجم' })
  variationTitleAr: string;

  @ApiPropertyOptional({ type: [VariationOptionDto] })
  options?: VariationOptionDto[];
}

export class GroupChoiceOptionDto {
  @ApiProperty({ example: 1 })
  choiceId: number;

  @ApiProperty({ example: 'Extra Cheese' })
  choiceName: string;

  @ApiProperty({ example: 'جبنة إضافية' })
  choiceNameAr: string;

  @ApiProperty({ example: 1.5 })
  price: number;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 1 })
  displayOrder: number;
}

export class ProductGroupChoiceDto {
  @ApiProperty({ example: 1 })
  groupId: number;

  @ApiProperty({ example: 'Extras' })
  groupName: string;

  @ApiProperty({ example: 'إضافات' })
  groupNameAr: string;

  @ApiProperty({ example: 3 })
  maximumChoices: number;

  @ApiProperty({ example: false })
  isRequired: boolean;

  @ApiProperty({ example: 1 })
  displayOrder: number;

  @ApiPropertyOptional({ type: [GroupChoiceOptionDto] })
  choices?: GroupChoiceOptionDto[];
}

export class ProductDto {
  @ApiProperty({ example: 1 })
  productId: number;

  @ApiProperty({ example: 21 })
  sectionId: number;

  @ApiProperty({ example: 'Cheese Burger' })
  nameEn: string;

  @ApiProperty({ example: 'برغر بالجبنة' })
  nameAr: string;

  @ApiPropertyOptional({ example: 'Juicy beef patty with cheese' })
  descriptionEn?: string;

  @ApiPropertyOptional({ example: 'باتي لحم بقر طازج مع الجبنة' })
  descriptionAr?: string;

  @ApiProperty({ example: 12.5 })
  price: number;

  @ApiProperty({ example: false })
  isDisabled: boolean;

  @ApiProperty({ example: '2025-01-01T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-01-01T10:00:00.000Z' })
  updatedAt: string;

  @ApiPropertyOptional({ type: [ProductImageDto] })
  images?: ProductImageDto[];

  @ApiPropertyOptional({ type: [ProductCategoryDto] })
  categories?: ProductCategoryDto[];

  @ApiPropertyOptional({ type: ProductVariationDto })
  variations?: ProductVariationDto;

  @ApiPropertyOptional({ type: [ProductGroupChoiceDto] })
  groupChoices?: ProductGroupChoiceDto[];
}
