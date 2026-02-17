import { IsString, IsEnum, IsArray, IsOptional } from 'class-validator';
import { NotificationType, NotificationTemplate } from '@app/notifications';

export class SendBulkNotificationDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsArray()
  @IsString({ each: true })
  recipients: string[];

  @IsString()
  subject: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsEnum(NotificationTemplate)
  template?: NotificationTemplate;
}
