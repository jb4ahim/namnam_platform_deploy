import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EarningEntryDto {
  @ApiProperty({ example: 1 })
  earningId!: number;

  @ApiProperty({ example: 42 })
  orderId!: number;

  @ApiProperty({ example: 3.5 })
  baseFee!: number;

  @ApiProperty({ example: 0.5 })
  distanceBonus!: number;

  @ApiProperty({ example: 1.0 })
  peakBonus!: number;

  @ApiProperty({ example: 0.0 })
  tip!: number;

  @ApiProperty({ example: 5.0 })
  total!: number;

  @ApiProperty({ example: '2024-06-01T12:00:00.000Z' })
  createdAt!: string;
}

export class EarningsSummaryDto {
  @ApiProperty({ example: 55.5 })
  totalEarned!: number;

  @ApiProperty({ example: 40.0 })
  baseFees!: number;

  @ApiProperty({ example: 5.0 })
  distanceBonuses!: number;

  @ApiProperty({ example: 7.5 })
  peakBonuses!: number;

  @ApiProperty({ example: 3.0 })
  tips!: number;

  @ApiProperty({ example: 12 })
  totalDeliveries!: number;

  @ApiPropertyOptional({ example: 'today', enum: ['today', 'week', 'month'] })
  period?: string;

  @ApiProperty({ type: [EarningEntryDto] })
  entries!: EarningEntryDto[];
}
