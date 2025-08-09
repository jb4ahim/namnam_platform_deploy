import { Injectable } from '@nestjs/common';
import { PostgresService } from '@app/database';

type InsertManagementUserParams = {
  name: string;
  email: string;
  phoneNumber?: string | null;
  defaultCurrency?: string | null;
  countryCode?: string | null;
  passwordHash: string;
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

  // Fetch login data via stored procedure/function for management user
  async getManagementUserByEmail(email: string): Promise<{
    management_user_id: string;
    user_id: string;
    email: string;
    password_hash: string;
    status?: string;
    name?: string;
    phone_number?: string;
    default_currency?: string;
    country_code?: string;
  } | null> {
    // Assuming a stored function/procedure exists to fetch user by email.
    // If it's a procedure returning OUT params: CALL get_management_user_by_email($1)
    // If it's a function returning a row: SELECT * FROM get_management_user_by_email($1)
    // We prefer CALL first; if no rows, fallback to SELECT.
      const rows = await this.pg.query('Select get_management_user_by_email_json($1)', [email]);
      console.log(rows);
      return rows?.[0] ?? null;

  }
}

