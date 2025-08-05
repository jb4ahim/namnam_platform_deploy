import { IsString, IsOptional, IsNumber, IsArray, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsNumber()
  cityId!: number;

  @IsNumber()
  countryId!: number;

  @IsString()
  street!: string;

  @IsString()
  addressDescription!: string;
}

export class CreateMerchantInfoDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  hotline!: string;

  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location!: LocationDto;

  @IsNumber()
  app_section_id!: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  cuisine_type_ids?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  shopTypeIds?: number[];
}