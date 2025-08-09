import { PostgresService } from '@app/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepository {
  constructor(private readonly pg: PostgresService) {}

  async saveOtp(countryCode: string, phoneNumber: string, otp:string) {
    // Calls a stored function, not a direct table query
    const rows = await this.pg.query('Call insert_users_otp($1, $2, $3, $4, $5)', [null,countryCode,  phoneNumber, 'phone', otp, null]);
    console.log('saveOtp', rows);
    return rows[0] || null;
  }

  async createWithPhone(phone: string) {
    // Calls a stored procedure or function
    const rows = await this.pg.query('SELECT  create_user_with_phone($1)', [phone]);
    return rows[0];
  }
}
