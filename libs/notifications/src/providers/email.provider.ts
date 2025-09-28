import { Injectable } from '@nestjs/common';
import { INotificationProvider } from '../interfaces/notification-provider.interface';
import { NotificationResponseDto, SendNotificationDto } from '../dto/notification.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailProvider implements INotificationProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      // Configure your email provider (Gmail, SendGrid, etc.)
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async send(notification: SendNotificationDto): Promise<NotificationResponseDto> {
    try {
      const result = await this.transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: notification.recipient,
        subject: notification.subject,
        text: notification.message,
        html: notification.data?.html || notification.message,
      });

      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
