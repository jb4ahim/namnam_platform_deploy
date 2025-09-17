import { IsOptional, IsString, MaxLength, IsNumber, IsBoolean } from 'class-validator';

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

  // URL to the image, not the key
  @IsString()
  logoUrl: string;
}
