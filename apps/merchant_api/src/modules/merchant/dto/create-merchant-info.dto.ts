import { IsString, IsOptional, IsNumber, IsArray, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


export class CreateMerchantInfoDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;


  @IsString()
  coverKey!: string;

  @IsNumber()
  categoryId!: number;

  @IsString()
  imageKey!: string;

  @IsArray()
  imageKeys!: string[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  cuisineTypeIds?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  shopTypeIds?: number[];
}