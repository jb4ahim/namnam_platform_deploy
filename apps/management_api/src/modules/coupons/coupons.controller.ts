import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';
import { CouponDto, ValidateCouponResponseDto } from './dto/coupon-response.dto';
import { AuthGuard } from '@app/auth';

@ApiTags('Coupons')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a coupon' })
  @ApiResponse({ status: 201, type: CouponDto, description: 'Coupon created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createCoupon(@Body() dto: CreateCouponDto) {
    return await this.couponsService.createCoupon(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all coupons' })
  @ApiResponse({ status: 200, type: [CouponDto], description: 'List of all coupons' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCoupons() {
    return await this.couponsService.getCoupons();
  }

  @Get('usage')
  @ApiOperation({ summary: 'Get coupon usage stats' })
  @ApiResponse({ status: 200, description: 'Coupon usage data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCouponUsage() {
    return await this.couponsService.getCouponUsage();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get coupon by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: CouponDto, description: 'Coupon details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  async getCouponById(@Param('id', ParseIntPipe) couponId: number) {
    return await this.couponsService.getCouponById(couponId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a coupon' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: CouponDto, description: 'Coupon updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateCoupon(
    @Param('id', ParseIntPipe) couponId: number,
    @Body() dto: UpdateCouponDto,
  ) {
    return await this.couponsService.updateCoupon(couponId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a coupon' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Coupon deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  async deleteCoupon(@Param('id', ParseIntPipe) couponId: number) {
    return await this.couponsService.deleteCoupon(couponId);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a coupon code' })
  @ApiResponse({ status: 201, type: ValidateCouponResponseDto, description: 'Coupon validation result' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async validateCoupon(@Body() dto: ValidateCouponDto) {
    return await this.couponsService.validateCoupon(dto);
  }
}
