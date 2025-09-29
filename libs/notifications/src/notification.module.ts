import { Module } from '@nestjs/common';
// Remove TypeORM for now until database is properly configured
// import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './services/notification.service';
import { EmailProvider } from './providers/email.provider';
import { FirebaseProvider } from './providers/firebase.provider';
import { TemplateService } from './services/template.service';
// import { NotificationLog } from './entities/notification-log.entity';

@Module({
  imports: [
    // Comment out TypeORM until database is properly configured
    // TypeOrmModule.forFeature([NotificationLog])
  ],
  providers: [NotificationService, EmailProvider, FirebaseProvider, TemplateService],
  exports: [NotificationService, EmailProvider, FirebaseProvider, TemplateService]
})
export class NotificationModule {}
