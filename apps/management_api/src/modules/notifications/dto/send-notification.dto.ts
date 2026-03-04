import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { NotificationType, NotificationTemplate } from '@app/notifications';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendNotificationDto {
  @ApiProperty({ description: 'Type of notification', enum: NotificationType, example: 'EMAIL' })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ description: 'Email address or FCM token of the recipient', example: 'user@example.com' })
  @IsString()
  recipient: string; // email address or FCM token

  @ApiProperty({ description: 'Subject of the notification', example: 'Welcome to Namnam!' })
  @IsString()
  subject: string;

  @ApiProperty({ description: 'Message body or content', example: 'Thank you for registering.' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ description: 'Preset template to use', enum: NotificationTemplate })
  @IsOptional()
  @IsEnum(NotificationTemplate)
  template?: NotificationTemplate;

  @ApiPropertyOptional({ description: 'Data payload to inject into the template', example: { name: 'John' } })
  @IsOptional()
  @IsObject()
  templateData?: Record<string, any>;
}
