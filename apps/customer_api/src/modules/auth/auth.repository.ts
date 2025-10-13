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

  // NEW: Verify OTP against database using stored procedure
  async verifyOtp(destination: string, code: string): Promise<boolean> {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'verify_user_otp',
      [destination, 'phone', code],
      false
    );
    return (result as boolean) || false;
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
