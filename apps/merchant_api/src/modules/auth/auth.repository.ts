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

  async registerUser(
  email: string,
  countryCode: string,
  phoneNumber: string,
  firstName: string,
  lastName: string,
  role: string
) {
  // Call the procedure with only IN parameters
  // OUT parameters are returned automatically
  console.log("version 1")
  const result = await this.pg.query(
    'CALL create_merchant($1, $2, $3, $4, $5, $6, $7)',
    [
      email,        // p_email
      countryCode,  // p_country_code  
      phoneNumber,  // p_phone_number
      firstName,    // p_first_name
      lastName,     // p_last_name
      role,         // p_role
      'USD'         // p_default_currency (explicit value instead of default)
    ]
  );
  
  // Access the result - should contain the OUT parameter values
  const row = result[0];
  
  if (!row.o_success) {
    throw new Error(row.o_message);
  }
  
  return row.o_user_id;
}

  async createWithPhone(phone: string) {
    // Calls a stored procedure or function
    const rows = await this.pg.query('SELECT create_user_with_phone($1)', [phone]);
    return rows[0];
  }
}