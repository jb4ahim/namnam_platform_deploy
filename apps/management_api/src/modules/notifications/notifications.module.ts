import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { NotificationModule } from '@app/notifications';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [JwtModule, NotificationModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
