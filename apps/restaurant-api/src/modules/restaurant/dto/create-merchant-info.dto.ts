import { IsString, IsOptional, IsNumber, IsArray, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsNumber()
  city_id!: number;

  @IsNumber()
  country_id!: number;

  @IsString()
  street!: string;

  @IsString()
  address_description!: string;
}

export class CreateMerchantInfoDto {
  @IsString()
  merchant_id!: string;

  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  hotline!: string;

  @IsString()
  logo_url!: string;

  @IsString()
  cover_url!: string;

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
  shop_type_ids?: number[];
}