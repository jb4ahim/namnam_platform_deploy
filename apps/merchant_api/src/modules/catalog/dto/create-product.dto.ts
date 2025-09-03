import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsNumber()
  sectionId!: number;

  @IsArray()
  @IsString({ each: true })
  imageKeys!: string[];

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

  @IsNumber()
  categoryId!: number;
}
