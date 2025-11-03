import { Injectable } from '@nestjs/common';
import { CouponsRepository } from './coupons.repository';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private readonly repo: CouponsRepository) {}

  async createCoupon(dto: CreateCouponDto) {
    await this.repo.createCoupon(dto);
    return { success: true };
  }

  async getCoupons() {
    return await this.repo.getCoupons();
  }

  async getCouponById(couponId: number) {
    return await this.repo.getCouponById(couponId);
  }

  async updateCoupon(couponId: number, dto: UpdateCouponDto) {
    await this.repo.updateCoupon(couponId, dto);
    return { success: true };
  }

  async deleteCoupon(couponId: number) {
    await this.repo.deleteCoupon(couponId);
    return { success: true };
  }

  async validateCoupon(dto: ValidateCouponDto) {
    return await this.repo.validateCoupon(dto);
  }

  async getCouponUsage() {
    return await this.repo.getCouponUsage();
  }
}
