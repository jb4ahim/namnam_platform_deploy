import { IsString, IsOptional, IsNumber, IsArray, IsObject, ValidateNested, IsPhoneNumber } from 'class-validator';
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

  @IsString()
  @IsPhoneNumber()
  hotline!: string;
}