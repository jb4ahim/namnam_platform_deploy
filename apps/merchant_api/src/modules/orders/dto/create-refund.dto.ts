import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRefundDto {
  @IsNumber()
  amount: number;

  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
