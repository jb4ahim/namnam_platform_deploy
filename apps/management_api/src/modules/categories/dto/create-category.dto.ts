import { IsNotEmpty, IsOptional, IsString, MaxLength, IsUUID, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'The name of the category', example: 'Burgers' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;


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


