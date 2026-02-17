import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { NotificationType, NotificationTemplate } from '@app/notifications';

export class SendNotificationDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  recipient: string; // email address or FCM token

  @IsString()
  subject: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsEnum(NotificationTemplate)
  template?: NotificationTemplate;

  @IsOptional()
  @IsObject()
  templateData?: Record<string, any>;
}
