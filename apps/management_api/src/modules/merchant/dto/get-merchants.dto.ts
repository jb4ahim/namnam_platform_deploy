import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { S3Url } from '@app/storage';

export class GetMerchantDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  isOwnedByApp?: boolean;

  @IsString()
  joinedAt: string;

  @IsString()
  @IsOptional()
  logoKey?: string;

  @S3Url()
  logoUrl?: string;
}
