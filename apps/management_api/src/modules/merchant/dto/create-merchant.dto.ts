import { IsString, IsOptional, IsEmail, IsPhoneNumber, IsEnum, IsBoolean } from 'class-validator';

export enum MerchantStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  REJECTED = 'REJECTED'
}

export class CreateMerchantDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  countryCode?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsEnum(MerchantStatus)
  @IsOptional()
  status?: MerchantStatus;

  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}