import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@app/auth';
import { NotificationsService } from './notifications.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { SendBulkNotificationDto } from './dto/send-bulk-notification.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send a push notification to a single user' })
  @ApiResponse({ status: 201, description: 'Notification sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async send(@Body() dto: SendNotificationDto) {
    return this.notificationsService.send(dto);
  }

  @Post('send-bulk')
  @ApiOperation({ summary: 'Send push notifications to multiple users' })
  @ApiResponse({ status: 201, description: 'Bulk notifications sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async sendBulk(@Body() dto: SendBulkNotificationDto) {
    return this.notificationsService.sendBulk(dto);
  }
}
