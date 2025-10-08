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

export enum PromotionActionType {
  NAVIGATE_TO_CATEGORY = 'NAVIGATE_TO_CATEGORY',
  NAVIGATE_TO_PRODUCT = 'NAVIGATE_TO_PRODUCT',
  OPEN_EXTERNAL_URL = 'OPEN_EXTERNAL_URL',
  OPEN_DEEPLINK = 'OPEN_DEEPLINK',
  NO_ACTION = 'NO_ACTION'
}

export class CreatePromotionDto {
  @IsString()
  @IsNotEmpty()
  titleArabic!: string;

  @IsString()
  @IsNotEmpty()
  titleEnglish!: string;

  @IsString()
  @IsOptional()
  descriptionArabic?: string;

  @IsString()
  @IsOptional()
  descriptionEnglish?: string;

  @IsString()
  @IsNotEmpty()
  imageKey!: string;

  @IsEnum(PromotionActionType)
  actionType!: PromotionActionType;

  @ValidateIf(o => o.actionType === PromotionActionType.NAVIGATE_TO_CATEGORY)
  @IsNumber()
  @IsPositive()
  categoryId?: number;

  @ValidateIf(o => o.actionType === PromotionActionType.NAVIGATE_TO_PRODUCT)
  @IsArray()
  @IsPositive()
  productIds?: number[];

  @ValidateIf(o => o.actionType === PromotionActionType.OPEN_EXTERNAL_URL)
  @IsString()
  @IsNotEmpty()
  externalUrl?: string;

  @ValidateIf(o => o.actionType === PromotionActionType.OPEN_DEEPLINK)
  @IsString()
  @IsNotEmpty()
  deeplink?: string;

  @IsNumber()
  @IsOptional()
  displayOrder?: number;

  @IsBoolean()
  @IsOptional()
  isDisabled?: boolean;
}

