import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

    export class UpdateItemDto {
        @ApiProperty({ description: 'New quantity of the cart item', example: 3 })
        @IsInt()
        @Min(1)
        quantity: number;
    }
