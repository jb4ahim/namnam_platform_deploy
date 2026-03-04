import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

    export class ApplyCouponDto {
        @ApiProperty({ description: 'Valid coupon code to apply to the cart', example: 'SUMMER21' })
        @IsString()
        coupon_code: string;
    }
