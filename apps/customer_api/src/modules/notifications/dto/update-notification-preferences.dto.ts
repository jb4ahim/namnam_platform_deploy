import { IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNotificationPreferencesDto {
  @ApiPropertyOptional({ description: 'Enable email notifications', example: true })
  @IsOptional()
  @IsBoolean()
  email_notifications?: boolean;

  @ApiPropertyOptional({ description: 'Enable push notifications', example: true })
  @IsOptional()
  @IsBoolean()
  push_notifications?: boolean;

  @ApiPropertyOptional({ description: 'Enable SMS notifications', example: false })
  @IsOptional()
  @IsBoolean()
  sms_notifications?: boolean;

  @ApiPropertyOptional({ description: 'Enable order updates notifications', example: true })
  @IsOptional()
  @IsBoolean()
  order_updates?: boolean;

  @ApiPropertyOptional({ description: 'Enable promotional offers notifications', example: false })
  @IsOptional()
  @IsBoolean()
  promotional_offers?: boolean;

  @ApiPropertyOptional({ description: 'Enable delivery updates notifications', example: true })
  @IsOptional()
  @IsBoolean()
  delivery_updates?: boolean;

  @ApiPropertyOptional({ description: 'Enable payment updates notifications', example: true })
  @IsOptional()
  @IsBoolean()
  payment_updates?: boolean;

  @ApiPropertyOptional({ description: 'Enable system announcements notifications', example: true })
  @IsOptional()
  @IsBoolean()
  system_announcements?: boolean;
}
