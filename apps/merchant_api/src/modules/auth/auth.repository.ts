import { DatabaseUtils, PostgresService } from '@app/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepository {
  constructor(private readonly pg: PostgresService) {}

  async saveOtpPhone(countryCode: string, phoneNumber: string, otp: string) {
    const result = await DatabaseUtils.callProcedure(
      this.pg,
      'insert_user_otp',
      [null, countryCode + phoneNumber, 'phone', otp, 15]
    );
    console.log('saveOtpPhone', result);
    return result || null;
  }

  async saveOtpEmail(email: string, otp: string) {
    const result = await DatabaseUtils.callProcedure(
      this.pg,
      'insert_user_otp',
      [null, email, 'email', otp, 15]
    );
    console.log('saveOtpEmail', result);
    return result || null;
  }

  async verifyOtp(destination: string, method: 'email' | 'phone', code: string): Promise<boolean> {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'verify_user_otp',
      [destination, 'phone', code],
      false
    );
    return result || false;
  }

  async registerUser(
    countryCode: string,
    phoneNumber: string,
    password: string
  ): Promise<{userId: number; merchantId: number}> {
    const result = await DatabaseUtils.callProcedure(
      this.pg,
      'insert_merchant',
      [
        countryCode,
        phoneNumber,
        password,
        'USD',
        null,
        null,
        null,
        null,
        null, 
        null,
        null,
        null
      ]
    );
    
    console.log('registerUser', result);
    
    if (!result?.o_success) {
      throw new Error(result?.o_message || 'User registration failed');
    }
    
    return {
      userId: result.o_user_id,
      merchantId: result.o_merchant_id
    };
  }
  async updateFcmToken(userId: number, fcmToken: string){
    await DatabaseUtils.callProcedure(
      this.pg,
      'update_fcm_token_merchant',
      [userId, fcmToken]
    );
  }
  async setLocale(merchantId: number, locale: string) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'update_merchant_locale',
      [merchantId, locale]
    );
  }

  async createWithPhone(phone: string) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'create_user_with_phone',
      [phone],
      false
    );
    return result;
  }
}