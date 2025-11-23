import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { UpdateNotificationPreferencesDto } from './dto/update-notification-preferences.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly repo: NotificationsRepository) {}

  async getNotifications(
    userId: number,
    limit?: number,
    offset?: number,
    isRead?: boolean,
    type?: string
  ) {
    return this.repo.getNotifications(userId, limit, offset, isRead, type);
  }

  async markAsRead(userId: number, notificationId: number) {
    return this.repo.markAsRead(userId, notificationId);
  }

  async markAllAsRead(userId: number) {
    return this.repo.markAllAsRead(userId);
  }

  async getPreferences(userId: number) {
    return this.repo.getPreferences(userId);
  }

  async updatePreferences(userId: number, dto: UpdateNotificationPreferencesDto) {
    return this.repo.updatePreferences(userId, dto);
  }

  async createNotification(userId: number, type: string, title: string, message: string, data?: any) {
    return this.repo.createNotification(userId, type, title, message, data);
  }
}
