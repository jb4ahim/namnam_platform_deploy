import { IsOptional, IsString, MaxLength, IsUUID, IsNumber } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

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


