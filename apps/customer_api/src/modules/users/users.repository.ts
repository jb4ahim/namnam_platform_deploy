import { DatabaseUtils, PostgresService } from '@app/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  constructor(private readonly pg: PostgresService) {}

  async saveOtp(phone: string, otp:string) {
    // Calls a stored function, not a direct table query
    const rows = await this.pg.query('Call insert_users_otp($1, $2, $3, $4, $5)', [null, phone, 'phone', otp, null]);
    console.log('saveOtp', rows);
    return rows[0] || null;
  }

  async findUserByPhone(countryCode: string, phoneNumber: string) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'fetch_user_by_phone',
      [countryCode, phoneNumber],
      false
    );
    console.log('findUserByPhone', result); 
    return (result) ?? null;
  }

  async getCustomerInfos(userId: number) {
    const result = await DatabaseUtils.callFunction(this.pg, 'select_customer_infos', [userId]);
    return result;
  }

  async createUserWithPhone(
    countryCode: string, 
    phoneNumber: string, 
    firstName: string, 
    lastName: string, 
    email?: string,
    gender?: string,
    birthday?: Date,
    defaultCurrency?: string,
    status?: string
  ): Promise<number> {
    const result = await DatabaseUtils.callProcedure(
      this.pg,
      'insert_customer_infos',
      [
        countryCode,
        phoneNumber, 
        firstName,
        lastName,
        null,
        email || null,
        gender || null,
        birthday || null,
        defaultCurrency || null,
        status || 'active'
      ]
    );
    
    console.log('createUserWithPhone', result);
    return result?.user_id || result?.p_user_id;
  }
}
