import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';

@Injectable()
export class NotificationsRepository {
  constructor(private readonly pg: PostgresService) {}

  async getNotifications(
    userId: number,
    limit?: number,
    offset?: number,
    isRead?: boolean
  ) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_user_notifications',
      [userId, limit || 50, offset || 0, isRead || null],
      false
    );
    return result || [];
  }

  async markAsRead(userId: number, notificationId: number) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'mark_notification_read',
      [userId, notificationId]
    );
    return { success: true, message: 'Notification marked as read' };
  }

  async markAllAsRead(userId: number) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'mark_all_notifications_read',
      [userId]
    );
    return { success: true, message: 'All notifications marked as read' };
  }

  async createNotification(userId: number, title: string, message: string, data?: any) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'create_notification',
      [userId, title, message, data || null]
    );
    return { success: true, message: 'Notification created' };
  }
}
