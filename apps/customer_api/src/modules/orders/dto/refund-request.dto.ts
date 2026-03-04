import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RefundRequestDto {
  @ApiProperty({ description: 'Reason for the refund request', example: 'Item was damaged' })
  @IsString()
  reason: string;

  @ApiPropertyOptional({ description: 'Additional notes for the refund request', example: 'The box was crushed during delivery.' })
  @IsOptional()
  @IsString()
  notes?: string;
}
