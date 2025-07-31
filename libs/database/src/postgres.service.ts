// libs/database/src/postgres.service.ts
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class PostgresService implements OnModuleDestroy {
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL, 
      // Optionally add { ssl: { rejectUnauthorized: false } } if Render requires SSL
    });
  }

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    const res = await this.pool.query(sql, params);
    return res.rows;
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
