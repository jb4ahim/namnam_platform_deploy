import { PostgresService } from '@app/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepository {
  constructor(private readonly pg: PostgresService) {}



  async saveOtpPhone(countryCode: string, phoneNumber: string, otp: string) {
    // Calls a stored function, not a direct table query
    const rows = await this.pg.query('CALL insert_user_otp($1, $2, $3, $4, $5)', [null, countryCode + phoneNumber, 'phone', otp, 15]);
    console.log('saveOtp', rows);
    return rows[0] || null;
  }

  // NEW: Verify OTP against database using stored procedure
  async verifyOtp(destination: string, code: string): Promise<boolean> {
    const rows = await this.pg.query('SELECT verify_user_otp($1, $2, $3) as is_valid', [destination, 'phone', code]);
    return rows[0]?.is_valid || false;
  }

  async createWithPhone(phone: string) {
    // Calls a stored procedure or function
    const rows = await this.pg.query('SELECT  create_user_with_phone($1)', [phone]);
    return rows[0];
  }
}
