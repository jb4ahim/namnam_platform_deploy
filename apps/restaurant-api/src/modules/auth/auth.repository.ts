import { Injectable } from '@nestjs/common';
import { PostgresService } from '@namnam/database';

@Injectable()
export class AuthRepository {
  constructor(private readonly pg: PostgresService) {}

  async saveOtpPhone(countryCode: string, phoneNumber: string, otp: string) {
    // Calls a stored function, not a direct table query
    const rows = await this.pg.query('CALL insert_user_otp($1, $2, $3, $4, $5)', [null, countryCode + phoneNumber, 'phone', otp, 15]);
    console.log('saveOtp', rows);
    return rows[0] || null;
  }

  async saveOtpEmail(email: string, otp: string) {
    // FIXED: Corrected to use proper stored procedure call with correct parameters
    const rows = await this.pg.query('CALL insert_user_otp($1, $2, $3, $4, $5)', [null, email, 'email', otp, 15]);
    console.log('saveOtp', rows);
    return rows[0] || null;
  }

  // NEW: Verify OTP against database using stored procedure
  async verifyOtp(destination: string, method: 'email' | 'phone', code: string): Promise<boolean> {
    const rows = await this.pg.query('SELECT verify_user_otp($1, $2, $3) as is_valid', [destination, method, code]);
    return rows[0]?.is_valid || false;
  }

  // UPDATED: Register user using PROCEDURE with correct parameter order
  async registerUser(
    email: string,
    countryCode: string,
    phoneNumber: string,
    firstName: string,
    lastName: string,
    role: string
  ) {
    // Calls the create_merchant stored procedure - only pass IN parameters
    // OUT parameters are handled automatically by PostgreSQL
   const rows = await this.pg.query(
      `CALL create_merchant(
        $1::varchar, 
        $2::varchar, 
        $3::varchar, 
        $4::varchar, 
        $5::varchar, 
        $6::varchar,
        $7::varchar
      )`, 
      [
        email,
        countryCode,
        phoneNumber,
        firstName,
        lastName,
        role,
        'USD' // Explicit currency parameter
      ]
    );
    
    const result = rows[0];
    if (!result.o_success) {
      throw new Error(result.o_message);
    }
    
    return result.o_user_id;
  }

  async createWithPhone(phone: string) {
    // Calls a stored procedure or function
    const rows = await this.pg.query('SELECT create_user_with_phone($1)', [phone]);
    return rows[0];
  }
}