import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(private readonly repo: NotificationsRepository) {}

  async getNotifications(
    userId: number,
    limit?: number,
    offset?: number,
    isRead?: boolean
  ) {
    return this.repo.getNotifications(userId, limit, offset, isRead);
  }

  async markAsRead(userId: number, notificationId: number) {
    return this.repo.markAsRead(userId, notificationId);
  }

  async markAllAsRead(userId: number) {
    return this.repo.markAllAsRead(userId);
  }

  async createNotification(userId: number, title: string, message: string, data?: any) {
    return this.repo.createNotification(userId, title, message, data);
  }
}
