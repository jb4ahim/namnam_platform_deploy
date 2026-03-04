import { IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ description: 'ID of the delivery address', example: 1 })
  @IsNumber()
  delivery_address_id: number;

  @ApiProperty({ description: 'ID of the cart to checkout', example: 42 })
  @IsNumber()
  cartId: number;

  @ApiProperty({ description: 'Payment method (e.g. cash, card)', example: 'card' })
  @IsString()
  payment_method: string;

  @ApiPropertyOptional({ description: 'Scheduled delivery date and time', example: '2023-12-01T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  scheduled_for?: string;

  @ApiPropertyOptional({ description: 'Special instructions for delivery', example: 'Leave at the front door' })
  @IsOptional()
  @IsString()
  delivery_instructions?: string;
}
