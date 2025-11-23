import { IsString, IsNumber, IsIn } from 'class-validator';

export class AddFavoriteDto {
  @IsString()
  @IsIn(['merchant', 'product'])
  entity_type: 'merchant' | 'product';

  @IsNumber()
  entity_id: number;
}
