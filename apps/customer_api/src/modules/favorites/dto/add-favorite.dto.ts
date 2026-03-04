import { IsString, IsNumber, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddFavoriteDto {
  @ApiProperty({ description: 'Type of entity to favorite', enum: ['merchant', 'product'], example: 'product' })
  @IsString()
  @IsIn(['merchant', 'product'])
  entity_type: 'merchant' | 'product';

  @ApiProperty({ description: 'ID of the entity (merchant or product)', example: 123 })
  @IsNumber()
  entity_id: number;
}
