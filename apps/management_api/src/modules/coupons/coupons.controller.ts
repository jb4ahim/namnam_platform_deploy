import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';
import { AuthGuard } from '@app/auth';

@ApiTags('Coupons')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a coupon' })
  async createCoupon(@Body() dto: CreateCouponDto) {
    return await this.couponsService.createCoupon(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all coupons' })
  async getCoupons() {
    return await this.couponsService.getCoupons();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get coupon by ID' })
  async getCouponById(@Param('id', ParseIntPipe) couponId: number) {
    return await this.couponsService.getCouponById(couponId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a coupon' })
  async updateCoupon(
    @Param('id', ParseIntPipe) couponId: number,
    @Body() dto: UpdateCouponDto,
  ) {
    return await this.couponsService.updateCoupon(couponId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a coupon' })
  async deleteCoupon(@Param('id', ParseIntPipe) couponId: number) {
    return await this.couponsService.deleteCoupon(couponId);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a coupon' })
  async validateCoupon(@Body() dto: ValidateCouponDto) {
    return await this.couponsService.validateCoupon(dto);
  }

  @Get('usage')
  @ApiOperation({ summary: 'Get coupon usage' })
  async getCouponUsage() {
    return await this.couponsService.getCouponUsage();
  }
}
