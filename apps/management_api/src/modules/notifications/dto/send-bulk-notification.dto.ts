import { IsString, IsEnum, IsArray, IsOptional } from 'class-validator';
import { NotificationType, NotificationTemplate } from '@app/notifications';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendBulkNotificationDto {
  @ApiProperty({ description: 'Type of notification', enum: NotificationType, example: 'PUSH' })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ description: 'List of recipients (emails or FMC tokens)', type: [String], example: ['user1@test.com', 'user2@test.com'] })
  @IsArray()
  @IsString({ each: true })
  recipients: string[];

  @ApiProperty({ description: 'Subject of the notification', example: 'Big Sale Today!' })
  @IsString()
  subject: string;

  @ApiProperty({ description: 'Message body or content', example: 'Get 50% off on all items.' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ description: 'Preset template to use', enum: NotificationTemplate })
  @IsOptional()
  @IsEnum(NotificationTemplate)
  template?: NotificationTemplate;
}
