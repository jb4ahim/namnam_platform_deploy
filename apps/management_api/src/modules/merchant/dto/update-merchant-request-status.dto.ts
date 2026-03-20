import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMerchantRequestStatusDto {
  @ApiProperty({ example: 'approved', description: 'New status: approved | rejected | pending' })
  @IsString()
  @IsNotEmpty()
  status!: string;

  @ApiPropertyOptional({ example: 2, description: 'Zone ID — required when approving' })
  @IsOptional()
  @IsInt()
  zoneId?: number;

  @ApiPropertyOptional({ example: 'Documents are incomplete', description: 'Reason for rejection' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @ApiPropertyOptional({ example: 3, description: 'Registration step ID that has the issue (shown to merchant)' })
  @IsOptional()
  @IsInt()
  stepId?: number;
}
