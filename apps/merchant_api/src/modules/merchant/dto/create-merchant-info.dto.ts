import { IsString, IsOptional, IsNumber, IsArray, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;


  @IsString()
  addressText!: string;
}

export class CreateMerchantInfoDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;


  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @IsString()
  coverKey!: string;
  
  @IsString()
  categoryId!: string;

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