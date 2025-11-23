import { IsOptional, IsString, IsBoolean, IsIn } from 'class-validator';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsString()
  @IsIn(['en', 'ar'])
  language?: string;

  @IsOptional()
  @IsString()
  @IsIn(['EGP', 'USD', 'EUR'])
  currency?: string;

  @IsOptional()
  @IsBoolean()
  notifications_enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  email_notifications?: boolean;

  @IsOptional()
  @IsBoolean()
  push_notifications?: boolean;

  @IsOptional()
  @IsBoolean()
  sms_notifications?: boolean;

  @IsOptional()
  @IsBoolean()
  marketing_emails?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(['light', 'dark', 'auto'])
  theme?: string;

  @IsOptional()
  @IsString()
  timezone?: string;
}
