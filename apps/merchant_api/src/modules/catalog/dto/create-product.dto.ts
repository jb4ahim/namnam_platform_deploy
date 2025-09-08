import { 
  IsString, 
  IsNotEmpty, 
  IsNumber, 
  IsArray, 
  IsOptional, 
  ValidateNested, 
  IsPositive,
  Min,
  Max
} from 'class-validator';
import { Type } from 'class-transformer';

export class VariationOptionDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  nameAr!: string;

  @IsNumber()
  @Min(0)
  price!: number;
}

export class ProductVariationsDto {
  @IsString()
  @IsNotEmpty()
  variationTitle!: string;

  @IsString()
  @IsNotEmpty()
  variationTitleAr!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariationOptionDto)
  options!: VariationOptionDto[];
}

export class GroupChoiceDto {
  @IsString()
  @IsNotEmpty()
  choiceName!: string;

  @IsString()
  @IsNotEmpty()
  choiceNameAr!: string;

  @IsNumber()
  @Min(0)
  price!: number;
}

export class GroupChoicesDto {
  @IsString()
  @IsNotEmpty()
  groupName!: string;

  @IsString()
  @IsNotEmpty()
  groupNameAr!: string;

  @IsNumber()
  @IsPositive()
  @Max(10) // Reasonable maximum for UI/UX
  maximumChoices!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GroupChoiceDto)
  choices!: GroupChoiceDto[];
}

export class CreateProductDto {
  @IsNumber()
  @IsPositive()
  sectionId!: number;

  @IsArray()
  @IsString({ each: true })
  imageKeys!: string[];

  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  @IsNotEmpty()
  productNameArabic!: string;

  @IsString()
  @IsNotEmpty()
  productNameEnglish!: string;

  @IsString()
  @IsOptional()
  productDescriptionArabic?: string;

  @IsString()
  @IsOptional()
  productDescriptionEnglish?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds!: number[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ProductVariationsDto)
  variations?: ProductVariationsDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GroupChoicesDto)
  groupChoices?: GroupChoicesDto[];
}