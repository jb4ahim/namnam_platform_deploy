import { Injectable } from '@nestjs/common';
import { INotificationProvider } from '../interfaces/notification-provider.interface';
import { NotificationResponseDto, SendNotificationDto } from '../dto/notification.dto';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseProvider implements INotificationProvider {
  private readonly isConfigured: boolean;

  constructor() {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    this.isConfigured = Boolean(projectId && clientEmail && privateKey);
    if (!this.isConfigured) {
      // Allow local/dev startup when Firebase credentials are not configured.
      console.warn(
        'FirebaseProvider: missing FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY; firebase notifications are disabled.',
      );
      return;
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        })
      });
    }
  }

  async send(notification: SendNotificationDto): Promise<NotificationResponseDto> {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Firebase is not configured',
      };
    }

    try {
      const message = {
        notification: {
          title: notification.subject,
          body: notification.message,
        },
        data: notification.data || {},
        token: notification.recipient, // Firebase token
      };

      const response = await admin.messaging().send(message);

      return {
        success: true,
        messageId: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
