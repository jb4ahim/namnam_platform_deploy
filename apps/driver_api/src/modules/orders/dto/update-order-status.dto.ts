import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'New order status',
    example: 'picked_up',
    enum: ['confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered'])
  status!: string;
}
