import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsNumber } from 'class-validator';

export class GetCategoryDto {
  @ApiProperty({ example: 15 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Pizza' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 14 })
  @IsNumber()
  @IsOptional()
  parentId?: number;

  @ApiPropertyOptional({ example: 'active' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  status?: string;

  @ApiPropertyOptional({ example: 'categories/pizza.jpg' })
  @IsString()
  @IsOptional()
  imageKey?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/categories/pizza.jpg' })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
