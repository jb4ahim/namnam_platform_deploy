import { IsString, IsNumber, IsOptional, IsIn, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'Rating from 1 to 5', minimum: 1, maximum: 5, example: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ description: 'Detailed text comment of the review', example: 'Great product, highly recommended!' })
  @IsOptional()
  @IsString()
  comment?: string;
}
