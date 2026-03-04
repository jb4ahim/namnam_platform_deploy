import { 
  IsString, 
  IsNotEmpty, 
  IsEnum, 
  IsOptional, 
  IsNumber,
  IsPositive,
  ValidateIf,
  IsArray,
  isBoolean,
  IsBoolean
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PromotionActionType {
  NAVIGATE_TO_CATEGORY = 'NAVIGATE_TO_CATEGORY',
  NAVIGATE_TO_PRODUCT = 'NAVIGATE_TO_PRODUCT',
  OPEN_EXTERNAL_URL = 'OPEN_EXTERNAL_URL',
  OPEN_DEEPLINK = 'OPEN_DEEPLINK',
  NO_ACTION = 'NO_ACTION'
}

export class CreatePromotionDto {
  @ApiProperty({ description: 'The Arabic title of the promotion', example: 'خصم 50٪ على الوجبات' })
  @IsString()
  @IsNotEmpty()
  titleArabic!: string;

  @ApiProperty({ description: 'The English title of the promotion', example: '50% off on meals' })
  @IsString()
  @IsNotEmpty()
  titleEnglish!: string;

  @ApiPropertyOptional({ description: 'Optional Arabic description', example: 'تفاصيل العرض...' })
  @IsString()
  @IsOptional()
  descriptionArabic?: string;

  @ApiPropertyOptional({ description: 'Optional English description', example: 'Offer details...' })
  @IsString()
  @IsOptional()
  descriptionEnglish?: string;

  @ApiProperty({ description: 'The S3 key or URL for the promotion banner image', example: 'promotions/summer-sale.png' })
  @IsString()
  @IsNotEmpty()
  imageKey!: string;

  @ApiProperty({ description: 'Action to take when user clicks the promotion', enum: PromotionActionType })
  @IsEnum(PromotionActionType)
  actionType!: PromotionActionType;

  @ApiPropertyOptional({ description: 'The ID of the category if action is NAVIGATE_TO_CATEGORY', example: 12 })
  @ValidateIf(o => o.actionType === PromotionActionType.NAVIGATE_TO_CATEGORY)
  @IsNumber()
  @IsPositive()
  categoryId?: number;

  @ApiPropertyOptional({ description: 'Array of product IDs if action is NAVIGATE_TO_PRODUCT', type: [Number], example: [101, 102] })
  @ValidateIf(o => o.actionType === PromotionActionType.NAVIGATE_TO_PRODUCT)
  @IsArray()
  @IsPositive()
  productIds?: number[];

  @ApiPropertyOptional({ description: 'External URL if action is OPEN_EXTERNAL_URL', example: 'https://example.com/promo' })
  @ValidateIf(o => o.actionType === PromotionActionType.OPEN_EXTERNAL_URL)
  @IsString()
  @IsNotEmpty()
  externalUrl?: string;

  @ApiPropertyOptional({ description: 'App deep link if action is OPEN_DEEPLINK', example: 'namnam://promo/123' })
  @ValidateIf(o => o.actionType === PromotionActionType.OPEN_DEEPLINK)
  @IsString()
  @IsNotEmpty()
  deeplink?: string;

  @ApiPropertyOptional({ description: 'Sort order for displaying the promotion', example: 1 })
  @IsNumber()
  @IsOptional()
  displayOrder?: number;

  @ApiPropertyOptional({ description: 'Flag to disable the promotion from showing', default: false })
  @IsBoolean()
  @IsOptional()
  isDisabled?: boolean;
}

