import { IsString, IsOptional } from 'class-validator';

export class RefundRequestDto {
  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
