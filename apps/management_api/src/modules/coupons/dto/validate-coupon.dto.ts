import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ValidateCouponDto {
  @ApiProperty({ description: 'Coupon code to validate', example: 'SUMMER50' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Total cart value to validate against minOrderAmount', example: 150 })
  @IsNumber()
  cartTotal: number;

  @ApiPropertyOptional({ description: 'ID of the user to check per-user limits', example: 10 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userId?: number;

  @ApiPropertyOptional({ description: 'ID of the merchant the cart belongs to', example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  merchantId?: number;

  @ApiPropertyOptional({ description: 'Product IDs in the cart to check specific product rules', type: [Number], example: [10, 11] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  cartItemProductIds?: number[];
}
