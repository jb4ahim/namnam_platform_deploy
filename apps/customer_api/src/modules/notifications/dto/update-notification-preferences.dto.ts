import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateNotificationPreferencesDto {
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
  order_updates?: boolean;

  @IsOptional()
  @IsBoolean()
  promotional_offers?: boolean;

  @IsOptional()
  @IsBoolean()
  delivery_updates?: boolean;

  @IsOptional()
  @IsBoolean()
  payment_updates?: boolean;

  @IsOptional()
  @IsBoolean()
  system_announcements?: boolean;
}
