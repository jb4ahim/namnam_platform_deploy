import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';
import { UpdateNotificationPreferencesDto } from './dto/update-notification-preferences.dto';

@Injectable()
export class NotificationsRepository {
  constructor(private readonly pg: PostgresService) {}

  async getNotifications(
    userId: number,
    limit?: number,
    offset?: number,
    isRead?: boolean,
    type?: string
  ) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_user_notifications',
      [userId, limit || 50, offset || 0, isRead || null, type || null],
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

  async getPreferences(userId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_notification_preferences',
      [userId],
      false
    );
    return result;
  }

  async updatePreferences(userId: number, dto: UpdateNotificationPreferencesDto) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'update_notification_preferences',
      [
        userId,
        dto.email_notifications ?? null,
        dto.push_notifications ?? null,
        dto.sms_notifications ?? null,
        dto.order_updates ?? null,
        dto.promotional_offers ?? null,
        dto.delivery_updates ?? null,
        dto.payment_updates ?? null,
        dto.system_announcements ?? null,
      ]
    );
    return { success: true, message: 'Notification preferences updated successfully' };
  }

  async createNotification(userId: number, type: string, title: string, message: string, data?: any) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'create_notification',
      [userId, type, title, message, data || null]
    );
    return { success: true, message: 'Notification created' };
  }
}
