import { IsOptional, IsString, MaxLength, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateCategoryDto {
  @ApiProperty({ description: 'ID of the category to update', example: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiPropertyOptional({ description: 'The name of the category', example: 'Burgers' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ description: 'Category type', example: 'food' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  type?: string;

  @ApiPropertyOptional({ description: 'Optional ID of the parent category for nested structures', example: 1 })
  @IsNumber()
  @IsOptional()
  parentId?: number;

  @ApiPropertyOptional({ description: 'Status of the category (e.g., ACTIVE, INACTIVE)', example: 'ACTIVE' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  status?: string;

  @ApiPropertyOptional({ description: 'S3 Object Key for the category image banner', example: 'categories/burgers.png' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  imageKey?: string;
}
