import { IsOptional, IsString, IsBoolean, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePreferencesDto {
  @ApiPropertyOptional({ description: 'Preferred language', enum: ['en', 'ar'], example: 'en' })
  @IsOptional()
  @IsString()
  @IsIn(['en', 'ar'])
  language?: string;

  @ApiPropertyOptional({ description: 'Preferred currency', enum: ['EGP', 'USD', 'EUR'], example: 'USD' })
  @IsOptional()
  @IsString()
  @IsIn(['EGP', 'USD', 'EUR'])
  currency?: string;

  @ApiPropertyOptional({ description: 'Global notifications toggle', example: true })
  @IsOptional()
  @IsBoolean()
  notifications_enabled?: boolean;

  @ApiPropertyOptional({ description: 'Email notifications toggle', example: false })
  @IsOptional()
  @IsBoolean()
  email_notifications?: boolean;

  @ApiPropertyOptional({ description: 'Push notifications toggle', example: true })
  @IsOptional()
  @IsBoolean()
  push_notifications?: boolean;

  @ApiPropertyOptional({ description: 'SMS notifications toggle', example: false })
  @IsOptional()
  @IsBoolean()
  sms_notifications?: boolean;

  @ApiPropertyOptional({ description: 'Marketing emails toggle', example: false })
  @IsOptional()
  @IsBoolean()
  marketing_emails?: boolean;

  @ApiPropertyOptional({ description: 'UI Theme preference', enum: ['light', 'dark', 'auto'], example: 'auto' })
  @IsOptional()
  @IsString()
  @IsIn(['light', 'dark', 'auto'])
  theme?: string;

  @ApiPropertyOptional({ description: 'User timezone', example: 'Asia/Beirut' })
  @IsOptional()
  @IsString()
  timezone?: string;
}
