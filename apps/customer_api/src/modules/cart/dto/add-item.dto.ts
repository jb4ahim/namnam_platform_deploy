import { IsNumber, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddItemDto {
  @ApiProperty({ description: 'ID of the product to add', example: 101 })
  @IsNumber()
  product_id: number;

  @ApiProperty({ description: 'Quantity of the product', example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;
}
