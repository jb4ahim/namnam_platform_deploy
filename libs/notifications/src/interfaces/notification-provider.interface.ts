import { NotificationResponseDto, SendNotificationDto } from '../dto/notification.dto';

export interface INotificationProvider {
  send(notification: SendNotificationDto): Promise<NotificationResponseDto>;
}
