import { IsOptional, IsString, MaxLength, IsNumber } from 'class-validator';
import { S3Url } from '@app/storage';

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

  @S3Url()
  imageUrl?: string;
}
