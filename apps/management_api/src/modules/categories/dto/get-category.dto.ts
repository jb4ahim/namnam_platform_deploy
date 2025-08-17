import { IsOptional, IsString, MaxLength, IsNumber } from 'class-validator';

export class GetCategoryDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  parentId?: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  status?: string;

  @IsString()
  @IsOptional()
  imageKey?: string;
  
  // URL to the image, not the key
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
