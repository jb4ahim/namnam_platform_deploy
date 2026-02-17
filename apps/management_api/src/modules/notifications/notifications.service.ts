import { Injectable } from '@nestjs/common';
import { NotificationService } from '@app/notifications';
import { SendNotificationDto } from './dto/send-notification.dto';
import { SendBulkNotificationDto } from './dto/send-bulk-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationService: NotificationService) {}

  async send(dto: SendNotificationDto) {
    return this.notificationService.send(dto);
  }

  async sendBulk(dto: SendBulkNotificationDto) {
    return this.notificationService.sendBulk(dto);
  }
}
