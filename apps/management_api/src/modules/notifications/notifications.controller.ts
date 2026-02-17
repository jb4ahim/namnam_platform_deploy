import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app/auth';
import { NotificationsService } from './notifications.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { SendBulkNotificationDto } from './dto/send-bulk-notification.dto';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  async send(@Body() dto: SendNotificationDto) {
    return this.notificationsService.send(dto);
  }

  @Post('send-bulk')
  async sendBulk(@Body() dto: SendBulkNotificationDto) {
    return this.notificationsService.sendBulk(dto);
  }
}
