import { IsNotEmpty, IsOptional, IsString, MaxLength, IsUUID, IsNumber } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
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
  @MaxLength(255)
  imageKey?: string;
}


