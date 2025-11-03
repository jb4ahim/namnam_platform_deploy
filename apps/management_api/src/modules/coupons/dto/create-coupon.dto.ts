import { IsArray, IsBoolean, IsDateString, IsInt, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CouponRuleDto {
  @IsString()
  type: string;

  @IsOptional()
  @IsNumber()
  value?: number;
}

export class CreateCouponDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  discountType: string;

  @IsNumber()
  discountValue: number;

  @IsOptional()
  @IsNumber()
  maxDiscountAmount?: number;

  @IsOptional()
  @IsNumber()
  minOrderAmount?: number;

  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxRedemptions?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  perUserLimit?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  applicableMerchantIds?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  applicableProductIds?: number[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CouponRuleDto)
  rules?: CouponRuleDto[];
}
