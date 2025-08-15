import { IsOptional, IsString, MaxLength, IsUUID, IsNumber } from 'class-validator';

export class UpdateCategoryDto {
  @IsNumber()
  @IsOptional()
  @MaxLength(100)
  name?: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  type?: string;

  @IsNumber()
  @IsOptional()
  parentId?: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  status?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  imageKey?: string;
}


