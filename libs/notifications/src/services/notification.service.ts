import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { INotificationProvider } from '../interfaces/notification-provider.interface';
import { NotificationResponseDto, NotificationType, SendNotificationDto, BulkNotificationDto, NotificationTemplate } from '../dto/notification.dto';
import { EmailProvider } from '../providers/email.provider';
import { FirebaseProvider } from '../providers/firebase.provider';
import { TemplateService } from './template.service';
import { NotificationLog } from '../entities/notification-log.entity';

@Injectable()
export class NotificationService {
  private providers: Map<NotificationType, INotificationProvider>;

  constructor(
    private emailProvider: EmailProvider,
    private firebaseProvider: FirebaseProvider,
    private templateService: TemplateService,
    @InjectRepository(NotificationLog)
    private notificationLogRepo: Repository<NotificationLog>,
  ) {
    this.providers = new Map([
      [NotificationType.EMAIL, this.emailProvider],
      [NotificationType.FIREBASE, this.firebaseProvider],
    ]);
  }

  async send(notification: SendNotificationDto): Promise<NotificationResponseDto> {
    // Create log entry
    const log = this.notificationLogRepo.create({
      type: notification.type,
      recipient: notification.recipient,
      subject: notification.subject,
      message: notification.message,
      template: notification.template,
      templateData: notification.templateData,
      status: 'pending',
    });
    await this.notificationLogRepo.save(log);

    try {
      let processedNotification = { ...notification };

      // Apply template if specified
      if (notification.template && notification.template !== NotificationTemplate.CUSTOM) {
        const rendered = this.templateService.renderTemplate(
          notification.template,
          notification.templateData || {}
        );
        processedNotification.subject = rendered.subject;
        processedNotification.message = rendered.text;
        processedNotification.data = {
          ...processedNotification.data,
          html: rendered.html,
        };
      }

      const provider = this.providers.get(notification.type);
      if (!provider) {
        throw new Error(`Unsupported notification type: ${notification.type}`);
      }

      const result = await provider.send(processedNotification);

      // Update log
      await this.notificationLogRepo.update(log.id, {
        status: result.success ? 'sent' : 'failed',
        messageId: result.messageId,
        error: result.error,
        deliveredAt: result.success ? new Date() : undefined,
      });

      return result;
    } catch (error) {
      await this.notificationLogRepo.update(log.id, {
        status: 'failed',
        error: error.message,
      });
      
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async sendBulk(bulkNotification: BulkNotificationDto): Promise<NotificationResponseDto[]> {
    const results = await Promise.allSettled(
      bulkNotification.recipients.map(recipient =>
        this.send({
          type: bulkNotification.type,
          recipient,
          subject: bulkNotification.subject,
          message: bulkNotification.message,
          template: bulkNotification.template,
          data: bulkNotification.data,
        })
      )
    );

    return results.map(result => 
      result.status === 'fulfilled' 
        ? result.value 
        : { success: false, error: result.reason }
    );
  }

  async getNotificationHistory(recipient?: string, type?: NotificationType) {
    const query = this.notificationLogRepo.createQueryBuilder('log');
    
    if (recipient) {
      query.andWhere('log.recipient = :recipient', { recipient });
    }
    
    if (type) {
      query.andWhere('log.type = :type', { type });
    }

    return query.orderBy('log.createdAt', 'DESC').getMany();
  }

  // Method to add new providers in the future
  addProvider(type: NotificationType, provider: INotificationProvider) {
    this.providers.set(type, provider);
  }
}
