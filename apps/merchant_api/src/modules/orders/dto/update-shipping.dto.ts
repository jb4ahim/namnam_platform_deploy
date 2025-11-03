import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateShippingDto {
  @IsString()
  carrier: string;

  @IsString()
  trackingNumber: string;

  @IsOptional()
  @IsDateString()
  shippedAt?: string;
}
