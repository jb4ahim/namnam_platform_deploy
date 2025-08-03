import { Injectable } from '@nestjs/common';
import { PostgresService } from '@namnam/database';

// Optionally import User type/interface if available
interface User {
  id: string;
  phone: string;
  // Add additional properties as needed
}

@Injectable()
export class AuthRepository {
  constructor(private readonly pg: PostgresService) {}

  /**
   * Find a user by phone number.
   * @param phone string
   * @returns User object or null
   */
  async findUserByPhone(phone: string): Promise<User | null> {
    const rows = await this.pg.query(
      'SELECT * FROM users WHERE phone = $1 LIMIT 1',
      [phone]
    );
    return rows[0] || null;
  }

  /**
   * Create a new user with this phone number.
   * @param phone string
   * @returns User object
   */
  async createUserWithPhone(phone: string): Promise<User> {
    const rows = await this.pg.query(
      'INSERT INTO users (phone) VALUES ($1) RETURNING *',
      [phone]
    );
    return rows[0];
  }

  /**
   * Optionally, blacklist a used JWT (for advanced security)
   */
  async blacklistJwt(jti: string, expiresAt: Date): Promise<void> {
    await this.pg.query(
      `INSERT INTO jwt_blacklist (jti, expires_at) VALUES ($1, $2)`,
      [jti, expiresAt]
    );
  }

  /**
   * Check if a JWT ID is blacklisted
   */
  async isJwtBlacklisted(jti: string): Promise<boolean> {
    const rows = await this.pg.query(
      `SELECT id FROM jwt_blacklist WHERE jti = $1 AND expires_at > NOW() LIMIT 1`,
      [jti]
    );
    return !!rows[0];
  }

  // Add any additional auth-related DB access methods as needed.
}
