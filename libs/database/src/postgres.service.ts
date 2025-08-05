// libs/database/src/postgres.service.ts
import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class PostgresService implements OnModuleDestroy {
  private readonly pool: Pool;
  private readonly logger = new Logger(PostgresService.name);

  constructor() {
    let config: any;

    // Try DATABASE_URL first, then fall back to individual variables
    if (process.env.DATABASE_URL) {
      this.logger.log('Using DATABASE_URL connection string');
      config = {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      };
    } else {
      this.logger.log('Using individual database environment variables');
      config = {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_DATABASE,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      };

      // Validate required environment variables
      const requiredVars = ['DB_HOST', 'DB_DATABASE', 'DB_USERNAME', 'DB_PASSWORD'];
      const missingVars = requiredVars.filter(varName => !process.env[varName]);
      
      if (missingVars.length > 0) {
        throw new Error(`Missing required database environment variables: ${missingVars.join(', ')}`);
      }

      this.logger.log(`Connecting to PostgreSQL at ${config.host}:${config.port}/${config.database}`);
    }

    // Add connection pool settings
    config = {
      ...config,
      max: 20, // Maximum number of clients in pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 5000, // Return error after 5 seconds if connection could not be established
      acquireTimeoutMillis: 60000, // Return error after 60 seconds if client could not be acquired
    };

    this.pool = new Pool(config);

    // Add error handling
    this.pool.on('error', (err) => {
      this.logger.error('Unexpected error on idle client', err);
    });

    this.pool.on('connect', () => {
      this.logger.debug('New client connected to PostgreSQL');
    });
  }

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    try {
      const res = await this.pool.query(sql, params);
      return res.rows;
    } catch (error) {
      // this.logger.error(`Database query failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Add a health check method
  async healthCheck(): Promise<boolean> {
    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return false;
    }
  }

  // Add connection pool stats
  getPoolStats() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
    };
  }

  async onModuleDestroy() {
    this.logger.log('Closing PostgreSQL connection pool...');
    await this.pool.end();
  }
}