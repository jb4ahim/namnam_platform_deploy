import { Injectable } from '@nestjs/common';
import { PostgresService } from '@namnam/database';

@Injectable()
export class UsersRepository {
  constructor(private readonly pg: PostgresService) {}

  async saveOtp(phone: string, otp:string) {
    // Calls a stored function, not a direct table query
    const rows = await this.pg.query('Call insert_users_otp($1, $2, $3, $4, $5)', [null, phone, 'phone', otp, null]);
    console.log('saveOtp', rows);
    return rows[0] || null;
  }

  async findUserByPhone(countryCode?: string,phoneNumber?: string, email?: string) {
    const rows = await this.pg.query('Call select_user_by_phone($1, $2, $3, $4, $5)', [countryCode, phoneNumber, email]);
    console.log('saveOtp', rows);
    return rows[0] || null;
  }

  async getUserInfos(userId: number) {
    const rows = await this.pg.query('Call select_user_infos($1, $2, $3, $4, $5)', [userId]);
    console.log('saveOtp', rows);
    return rows[0] || null;
  }

  async createUserWithPhone(countryCode: string, phoneNumber: string, firstName: string, lastName: string, email?: string): Promise<number> {
    const query = ` CALL insert_customer_simple($1, $2, $3, $4, $5, new_user_id);`;
    
    const rows = await this.pg.query(query, [countryCode, phoneNumber, firstName, lastName, email || null]);
    console.log('createUserWithPhone', rows);
    return rows[0].new_user_id || null;
    }
}
