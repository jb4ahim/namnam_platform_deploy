import { IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  delivery_address_id: number;

  @IsNumber()
  cartId: number;

  @IsString()
  payment_method: string;

  @IsOptional()
  @IsDateString()
  scheduled_for?: string;

  @IsOptional()
  @IsString()
  delivery_instructions?: string;
}
