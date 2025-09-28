import { Module } from '@nestjs/common';
import { NotificationService } from './services/notification.service';
import { EmailProvider } from './providers/email.provider';
import { FirebaseProvider } from './providers/firebase.provider';

@Module({
  providers: [NotificationService, EmailProvider, FirebaseProvider],
  exports: [NotificationService],
})
export class NotificationModule {}
