import { Controller, Get, Put, Query, Param, ParseIntPipe, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app/auth/jwt-auth.guard';
import { CurrentUserId } from '@app/common/decorators';
import { NotificationsService } from './notifications.service';
import { UpdateNotificationPreferencesDto } from './dto/update-notification-preferences.dto';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(
    @CurrentUserId() userId: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
    @Query('isRead') isRead?: boolean,
    @Query('type') type?: string,
  ) {
    return await this.notificationsService.getNotifications(userId, limit, offset, isRead, type);
  }

  @Put(':id/read')
  async markAsRead(
    @CurrentUserId() userId: number,
    @Param('id', ParseIntPipe) notificationId: number,
  ) {
    return await this.notificationsService.markAsRead(userId, notificationId);
  }

  @Put('read-all')
  async markAllAsRead(@CurrentUserId() userId: number) {
    return await this.notificationsService.markAllAsRead(userId);
  }

  @Get('preferences')
  async getPreferences(@CurrentUserId() userId: number) {
    return await this.notificationsService.getPreferences(userId);
  }

  @Put('preferences')
  async updatePreferences(
    @CurrentUserId() userId: number,
    @Body() dto: UpdateNotificationPreferencesDto,
  ) {
    return await this.notificationsService.updatePreferences(userId, dto);
  }
}
