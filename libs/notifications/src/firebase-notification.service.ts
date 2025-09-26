import { Injectable } from '@nestjs/common';
import * as admin from "firebase-admin";

@Injectable()
export class FirebaseNotificationService {
    async sendNotification(to: string, message: string) {
        const payload = {
            notification: {
                title: 'New Message',
                body: message,
            },
            token: to,
        };

        try {
            const response = await admin.messaging().send(payload);
            console.log(`Successfully sent message: ${response}`);
            return { success: true };
        } catch (error) {
            console.error(`Error sending message: ${error}`);
            return { success: false, error };
        }
    }

}
