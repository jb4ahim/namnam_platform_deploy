import { IsString, IsOptional, IsEmail, IsPhoneNumber, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum MerchantStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  REJECTED = 'REJECTED'
}

export class CreateMerchantDto {
  @ApiProperty({ description: 'Merchant officially registered name', example: 'NamNam Burger Joint' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'About the merchant', example: 'Best burgers in town' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Primary contact email for the merchant', example: 'contact@burgerjoint.com' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ description: 'Country code for phone number', example: 'AE' })
  @IsString()
  @IsOptional()
  countryCode?: string;

  @ApiPropertyOptional({ description: 'Merchant contact phone number', example: '+971501234567' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Physical address of the main branch', example: 'Shop 12, Main Street' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'Current status of the merchant', enum: MerchantStatus, default: MerchantStatus.PENDING })
  @IsEnum(MerchantStatus)
  @IsOptional()
  status?: MerchantStatus;

  @ApiPropertyOptional({ description: 'Verification approval status', default: false })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}