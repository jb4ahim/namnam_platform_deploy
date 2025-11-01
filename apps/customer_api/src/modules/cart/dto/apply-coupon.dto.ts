import { IsString } from 'class-validator';

    export class ApplyCouponDto {
        @IsString()
        coupon_code: string;
    }
