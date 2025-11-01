import { IsNumber, IsInt, IsOptional, IsString, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsNumber()
  product_id: number;

  @IsInt()
  quantity: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateOrderDto {
  @IsNumber()
  merchant_id: number;

  @IsNumber()
  delivery_address_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString()
  payment_method: string;

  @IsOptional()
  @IsDateString()
  scheduled_for?: string;

  @IsOptional()
  @IsString()
  delivery_instructions?: string;
}
