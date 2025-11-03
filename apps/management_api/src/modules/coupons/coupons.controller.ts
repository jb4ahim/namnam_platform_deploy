import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  async createCoupon(@Body() dto: CreateCouponDto) {
    return await this.couponsService.createCoupon(dto);
  }

  @Get()
  async getCoupons() {
    return await this.couponsService.getCoupons();
  }

  @Get(':id')
  async getCouponById(@Param('id', ParseIntPipe) couponId: number) {
    return await this.couponsService.getCouponById(couponId);
  }

  @Put(':id')
  async updateCoupon(
    @Param('id', ParseIntPipe) couponId: number,
    @Body() dto: UpdateCouponDto,
  ) {
    return await this.couponsService.updateCoupon(couponId, dto);
  }

  @Delete(':id')
  async deleteCoupon(@Param('id', ParseIntPipe) couponId: number) {
    return await this.couponsService.deleteCoupon(couponId);
  }

  @Post('validate')
  async validateCoupon(@Body() dto: ValidateCouponDto) {
    return await this.couponsService.validateCoupon(dto);
  }

  @Get('usage')
  async getCouponUsage() {
    return await this.couponsService.getCouponUsage();
  }
}
