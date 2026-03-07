import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({ example: 1 })
  order_item_id: number;

  @ApiProperty({ example: 10 })
  product_id: number;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 12.5 })
  unit_price: number;

  @ApiPropertyOptional({ example: 'No onions' })
  notes?: string;
}

export class OrderDeliveryDto {
  @ApiPropertyOptional({ example: 'Hamra Street' })
  address_line1?: string;

  @ApiPropertyOptional({ example: 'Apt 3' })
  address_line2?: string;

  @ApiPropertyOptional({ example: 'Beirut' })
  city?: string;

  @ApiPropertyOptional({ example: 'Beirut Governorate' })
  state?: string;

  @ApiPropertyOptional({ example: '1100' })
  postal_code?: string;

  @ApiPropertyOptional({ example: 'LB' })
  country?: string;

  @ApiPropertyOptional({ example: 33.8935 })
  latitude?: number;

  @ApiPropertyOptional({ example: 35.5018 })
  longitude?: number;

  @ApiPropertyOptional({ example: 'Home' })
  label?: string;

  @ApiPropertyOptional({ example: 'Ring the bell' })
  instructions?: string;
}

export class OrderPaymentDto {
  @ApiProperty({ example: 1 })
  payment_id: number;

  @ApiProperty({ example: 55.0 })
  amount: number;

  @ApiProperty({ example: 'paid' })
  status: string;

  @ApiPropertyOptional({ example: 'txn_abc123' })
  transaction_id?: string;

  @ApiProperty({ example: '2025-01-01T10:00:00.000Z' })
  created_at: string;
}

export class OrderSummaryDto {
  @ApiProperty({ example: 101 })
  order_id: number;

  @ApiProperty({ example: 7 })
  customer_id: number;

  @ApiProperty({ example: 55.0 })
  total_amount: number;

  @ApiProperty({ example: 'pending', enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'] })
  status: string;

  @ApiProperty({ example: 'cash', enum: ['cash', 'card', 'online'] })
  payment_method: string;

  @ApiPropertyOptional({ example: '2025-01-01T12:00:00.000Z' })
  scheduled_for?: string;

  @ApiProperty({ example: '2025-01-01T10:00:00.000Z' })
  created_at: string;

  @ApiProperty({ example: '2025-01-01T10:05:00.000Z' })
  updated_at: string;
}

export class OrderDetailDto extends OrderSummaryDto {
  @ApiProperty({ example: 5 })
  merchant_id: number;

  @ApiProperty({ type: [OrderItemDto] })
  items: OrderItemDto[];

  @ApiPropertyOptional({ type: OrderDeliveryDto })
  delivery?: OrderDeliveryDto;

  @ApiPropertyOptional({ type: OrderPaymentDto })
  payment?: OrderPaymentDto;
}
