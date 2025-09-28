import { IsString, IsEmail, IsEnum, IsOptional, IsObject } from 'class-validator';

export enum NotificationType {
  EMAIL = 'email',
  FIREBASE = 'firebase'
}

export enum NotificationTemplate {
  WELCOME = 'welcome',
  PASSWORD_RESET = 'password-reset',
  ORDER_CONFIRMATION = 'order-confirmation',
  PAYMENT_SUCCESS = 'payment-success',
  CUSTOM = 'custom'
}

export class SendNotificationDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  recipient: string; // email address or Firebase token

  @IsString()
  subject: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>; // Additional data for Firebase or email templates

  @IsOptional()
  @IsEnum(NotificationTemplate)
  template?: NotificationTemplate;

  @IsOptional()
  @IsObject()
  templateData?: Record<string, any>; // Variables for template rendering
}

export class NotificationResponseDto {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class BulkNotificationDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString({ each: true })
  recipients: string[];

  @IsString()
  subject: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsEnum(NotificationTemplate)
  template?: NotificationTemplate;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;
}
