import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';

@Injectable()
export class CouponsRepository {
  constructor(private readonly pg: PostgresService) {}

  async createCoupon(dto: CreateCouponDto) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'create_coupon_management',
      [
        dto.code,
        dto.name,
        dto.description ?? null,
        dto.discountType,
        dto.discountValue,
        dto.maxDiscountAmount ?? null,
        dto.minOrderAmount ?? null,
        dto.startsAt ?? null,
        dto.endsAt ?? null,
        dto.isActive ?? true,
        dto.maxRedemptions ?? null,
        dto.perUserLimit ?? null,
        dto.applicableMerchantIds ? JSON.stringify(dto.applicableMerchantIds) : null,
        dto.applicableProductIds ? JSON.stringify(dto.applicableProductIds) : null,
        dto.rules ? JSON.stringify(dto.rules) : null,
      ],
    );
  }

  async getCoupons() {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_coupons_management',
      [],
      true,
    );
    return result || [];
  }

  async getCouponById(couponId: number) {
    return await DatabaseUtils.callFunction(
      this.pg,
      'select_coupon_by_id_management',
      [couponId],
      false,
    );
  }

  async updateCoupon(couponId: number, dto: UpdateCouponDto) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'update_coupon_management',
      [
        couponId,
        dto.name ?? null,
        dto.description ?? null,
        dto.discountType ?? null,
        dto.discountValue ?? null,
        dto.maxDiscountAmount ?? null,
        dto.minOrderAmount ?? null,
        dto.startsAt ?? null,
        dto.endsAt ?? null,
        dto.isActive ?? null,
        dto.maxRedemptions ?? null,
        dto.perUserLimit ?? null,
        dto.applicableMerchantIds ? JSON.stringify(dto.applicableMerchantIds) : null,
        dto.applicableProductIds ? JSON.stringify(dto.applicableProductIds) : null,
        dto.rules ? JSON.stringify(dto.rules) : null,
      ],
    );
  }

  async deleteCoupon(couponId: number) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'delete_coupon_management',
      [couponId],
    );
  }

  async validateCoupon(dto: ValidateCouponDto) {
    return await DatabaseUtils.callFunction(
      this.pg,
      'validate_coupon_management',
      [
        dto.code,
        dto.cartTotal,
        dto.userId ?? null,
        dto.merchantId ?? null,
        dto.cartItemProductIds ? JSON.stringify(dto.cartItemProductIds) : null,
      ],
      false,
    );
  }

  async getCouponUsage() {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_coupon_usage_management',
      [],
      true,
    );
    return result || [];
  }
}
