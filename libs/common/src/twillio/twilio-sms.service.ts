// src/common/twilio/twilio-sms.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import { LoggerService } from '../logger';

@Injectable()
export class TwilioSmsService {
  private twilioClient: twilio.Twilio;
  private verifyServiceSid: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    const verifyServiceSid = this.configService.get<string>('TWILIO_VERIFY_SERVICE_SID');
    
    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials are not configured');
    }

    if (!verifyServiceSid) {
      throw new Error('Twilio Verify Service SID is not configured');
    }

    this.verifyServiceSid = verifyServiceSid;
    this.twilioClient = twilio(accountSid, authToken);
  }

  /**
   * Send OTP via Twilio Verify Service
   * @param phoneNumber - Phone number in international format (e.g., +1234567890)
   */
  async sendOTPViaSMS(phoneNumber: string): Promise<void> {
    try {
      const verification = await this.twilioClient.verify.v2
        .services(this.verifyServiceSid)
        .verifications.create({
          to: phoneNumber,
          channel: 'sms'
        });

      this.logger.debug('OTP sent via Verify service', {
        phoneNumber,
        sid: verification.sid,
        status: verification.status,
        channel: verification.channel
      });

    } catch (error) {
      this.logger.error('Failed to send OTP via Verify service', {
        phoneNumber,
        error: error
      });
      throw new Error(`Failed to send OTP: ${error}`);
    }
  }

  /**
   * Verify OTP using Twilio Verify Service
   * @param phoneNumber - Phone number in international format
   * @param code - The OTP code to verify
   */
  async verifyOTP(phoneNumber: string, code: string): Promise<boolean> {
    try {
      const verification = await this.twilioClient.verify.v2
        .services(this.verifyServiceSid)
        .verificationChecks.create({
          to: phoneNumber,
          code: code
        });

      this.logger.debug('OTP verification attempt',
      {
        phoneNumber,
        status: verification.status,
        valid: verification.valid
      }
    );

      return verification.status === 'approved';

    } catch (error) {
      this.logger.error('Failed to verify OTP', {
        phoneNumber,
        error: error,
      });
      throw new Error(`Failed to verify OTP: ${error}`);
    }
  }

  /**
   * Send custom SMS message (fallback method)
   * @param phoneNumber - Phone number in international format
   * @param message - Message to send
   */
  async sendSMS(phoneNumber: string, message: string): Promise<void> {
    try {
      // For Lebanon, alphanumeric sender ID is required
      const ALPHANUMERIC_ID = 'NamNam'; 
  
      const result = await this.twilioClient.messages.create({
        from: ALPHANUMERIC_ID,
        to: phoneNumber,
        body: message
      });
  
      this.logger.info('SMS sent successfully', {
        phoneNumber,
        messageSid: result.sid,
        status: result.status
      });
  
    } catch (error: any) {
      this.logger.error(
        'Failed to send SMS', 
        {
          phoneNumber,
          error: error.message,
          errorCode: error.code,
          moreInfo: error.moreInfo
        }
      );
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }
  

  /**
   * Format phone number to international format
   * @param phoneNumber - Phone number to format
   * @param defaultCountryCode - Default country code (e.g., '961' for Lebanon)
   */
  formatPhoneNumber(phoneNumber: string, defaultCountryCode: string = '961'): string {
    // Remove all non-digit characters except +
    let cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    // If it doesn't start with +, add country code
    if (!cleaned.startsWith('+')) {
      // Handle different cases
      if (cleaned.startsWith('00')) {
        // Remove 00 and add +
        cleaned = '+' + cleaned.substring(2);
      } else if (cleaned.startsWith('0')) {
        // Remove leading 0 and add country code
        cleaned = '+' + defaultCountryCode + cleaned.substring(1);
      } else if (!cleaned.startsWith(defaultCountryCode)) {
        // Add country code if not present
        cleaned = '+' + defaultCountryCode + cleaned;
      } else {
        // Already has country code, just add +
        cleaned = '+' + cleaned;
      }
    }

    return cleaned;
  }

  /**
   * Validate phone number format
   * @param phoneNumber - Phone number to validate
   */
  isValidPhoneNumber(phoneNumber: string): boolean {
    // International phone number regex (E.164 format)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
  }
}