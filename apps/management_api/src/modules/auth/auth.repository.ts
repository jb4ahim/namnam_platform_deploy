import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';

type InsertManagementUserParams = {
  name: string;
  email: string;
  phoneNumber?: string | null;
  defaultCurrency?: string | null;
  countryCode?: string | null;
  passwordHash: string;
};
type ManagementUser = {
  management_user_id: string;
  user_id: string;
  email: string;
  password_hash: string;
  status?: string;
  name?: string;
  phone_number?: string;
  default_currency?: string;
  country_code?: string;
};
@Injectable()
export class AuthRepository {
  constructor(private readonly pg: PostgresService) {}

  // Calls stored procedure insert_management_user; no ad-hoc SQL tables access
  async insertManagementUser(params: InsertManagementUserParams): Promise<{
  management_user_id: string;
  user_id: string;
  status?: string;
}> {
  // Use CALL for procedures, not SELECT
  // The procedure has OUT parameters, so we need to handle them properly
  const rows = await this.pg.query(
    'CALL insert_management_user($1, $2, $3, $4, $5, $6, NULL, NULL, NULL)',
    [
      params.name,
      params.email,
      params.phoneNumber ?? null,
      params.defaultCurrency ?? null,
      params.countryCode ?? null,
      params.passwordHash
    ]
  );

  const row: any = rows?.[0] ?? {};

  return {
    management_user_id: (row.management_user_id ?? row.o_management_user_id ?? row.mgmt_user_id)?.toString(),
    user_id: (row.user_id ?? row.o_user_id)?.toString(),
    status: row.status ?? row.o_status
  };
}

  /**
   * Get management user by email using database function
   */
  async getManagementUserByEmail(email: string): Promise<ManagementUser | null> {
    const result = await DatabaseUtils.callFunction<ManagementUser>(
      this.pg,
      'get_management_user_by_email_json',
      [email]
    );

    if (!result) {
      return null;
    }

    // Ensure proper type conversion and handle possible array result
    const user = Array.isArray(result) ? result[0] : result;
    return {
      management_user_id: user?.management_user_id?.toString(),
      user_id: user?.user_id?.toString(),
      email: user?.email,
      password_hash: user?.password_hash,
      status: user?.status,
      name: user?.name,
      phone_number: user?.phone_number,
      default_currency: user?.default_currency,
      country_code: user?.country_code
  }
}

}