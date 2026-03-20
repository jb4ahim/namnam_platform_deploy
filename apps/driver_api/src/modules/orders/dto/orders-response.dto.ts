import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({ example: 1 })
  productId!: number;

  @ApiProperty({ example: 'Chicken Burger' })
  productName!: string;

  @ApiProperty({ example: 2 })
  quantity!: number;

  @ApiProperty({ example: 15.99 })
  unitPrice!: number;
}

export class DriverOrderResponseDto {
  @ApiProperty({ example: 42 })
  orderId!: number;

  @ApiProperty({ example: 'out_for_delivery' })
  status!: string;

  @ApiProperty({ example: '2024-06-01T12:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: 'Burger House' })
  merchantName!: string;

  @ApiPropertyOptional({ example: '123 Main St, Beirut' })
  merchantAddress?: string;

  @ApiPropertyOptional({ example: '+96170000000' })
  merchantPhone?: string;

  @ApiPropertyOptional({ example: '456 Oak Ave, Beirut' })
  deliveryAddress?: string;

  @ApiProperty({ example: 35.5 })
  totalAmount!: number;

  @ApiProperty({ example: 'cash' })
  paymentMethod!: string;

  @ApiProperty({ type: [OrderItemDto] })
  items!: OrderItemDto[];
}
