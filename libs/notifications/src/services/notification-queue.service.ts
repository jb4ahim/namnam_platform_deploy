import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { SendNotificationDto, BulkNotificationDto } from '../dto/notification.dto';

@Injectable()
export class NotificationQueueService {
  constructor(
    @InjectQueue('notifications') private notificationQueue: Queue,
  ) {}

  async addToQueue(notification: SendNotificationDto, delay = 0) {
    return this.notificationQueue.add('send-notification', notification, {
      delay,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
  }

  async addBulkToQueue(bulkNotification: BulkNotificationDto, delay = 0) {
    return this.notificationQueue.add('send-bulk-notification', bulkNotification, {
      delay,
      attempts: 3,
    });
  }

  async scheduleNotification(notification: SendNotificationDto, scheduleTime: Date) {
    const delay = scheduleTime.getTime() - Date.now();
    return this.addToQueue(notification, delay);
  }
}
