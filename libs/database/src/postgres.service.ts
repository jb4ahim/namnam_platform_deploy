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
        // Always use SSL for Render.com connections, regardless of NODE_ENV
        ssl: this.isRenderDatabase() ? { rejectUnauthorized: false } : 
              (process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false),
      };
    } else {
      this.logger.log('Using individual database environment variables');
      config = {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_DATABASE,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        // Always use SSL for Render.com connections
        ssl: this.isRenderDatabase() ? { rejectUnauthorized: false } : 
              (process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false),
      };

      // Validate required environment variables
      const requiredVars = ['DB_HOST', 'DB_DATABASE', 'DB_USERNAME', 'DB_PASSWORD'];
      const missingVars = requiredVars.filter(varName => !process.env[varName]);
      
      if (missingVars.length > 0) {
        throw new Error(`Missing required database environment variables: ${missingVars.join(', ')}`);
      }

      this.logger.log(`Connecting to PostgreSQL at ${config.host}:${config.port}/${config.database}`);
    }

    // Optimized connection pool settings for Render.com
    config = {
      ...config,
      max: 5, // Reduced from 20 to avoid connection limits on Render
      min: 1, // Keep at least 1 connection alive
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 15000, // Increased from 5s to 15s for external DB
      acquireTimeoutMillis: 60000, // Return error after 60 seconds if client could not be acquired
      
      // Additional resilience settings
      statement_timeout: 30000, // 30 second statement timeout
      query_timeout: 30000, // 30 second query timeout
      keepAlive: true, // Enable TCP keep-alive
      keepAliveInitialDelayMillis: 10000, // Wait 10 seconds before starting keep-alive
    };

    this.pool = new Pool(config);

    // Enhanced error handling
    this.pool.on('error', (err) => {
      this.logger.error('Unexpected error on idle client', err);
      
      // Log additional context for ECONNRESET errors
      if (err.message.includes('ECONNRESET')) {
        this.logger.error('Connection reset detected. This may indicate network issues or database timeout.');
        this.logPoolStats();
      }
    });

    this.pool.on('connect', (client) => {
      this.logger.debug('New client connected to PostgreSQL');
      
      // Set application name for easier debugging
      client.query("SET application_name = 'namnam_platform'").catch((err) => {
        this.logger.warn('Failed to set application name:', err.message);
      });
    });

    this.pool.on('acquire', () => {
      this.logger.debug('Client acquired from pool');
    });

    this.pool.on('release', () => {
      this.logger.debug('Client released back to pool');
    });

    // Test initial connection
    this.testConnection();
  }

  private isRenderDatabase(): boolean {
    const dbHost = process.env.DB_HOST || '';
    const dbUrl = process.env.DATABASE_URL || '';
    return dbHost.includes('render.com') || dbUrl.includes('render.com');
  }

  private async testConnection(): Promise<void> {
    try {
      const result = await this.healthCheck();
      if (result) {
        this.logger.log('Database connection test successful');
      } else {
        this.logger.error('Database connection test failed');
      }
    } catch (error) {
      this.logger.error('Initial database connection failed:', error.message);
    }
  }

  private logPoolStats(): void {
    const stats = this.getPoolStats();
    this.logger.log(`Pool stats - Total: ${stats.totalCount}, Idle: ${stats.idleCount}, Waiting: ${stats.waitingCount}`);
  }

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    const startTime = Date.now();
    let client;
    
    try {
      // Add retry logic for connection issues
      client = await this.pool.connect();
      const res = await client.query(sql, params);
      
      const duration = Date.now() - startTime;
      this.logger.debug(`Query executed in ${duration}ms`);
      
      return res.rows;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`Database query failed after ${duration}ms: ${error.message}`);
      
      // Log additional context for connection errors
      if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        this.logger.error('Connection error detected. Pool stats:', this.getPoolStats());
        
        // For ECONNRESET specifically, wait a moment and retry once
        if (error.code === 'ECONNRESET') {
          this.logger.log('Attempting retry after ECONNRESET...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          try {
            const retryClient = await this.pool.connect();
            const retryRes = await retryClient.query(sql, params);
            retryClient.release();
            this.logger.log('Retry successful after ECONNRESET');
            return retryRes.rows;
          } catch (retryError) {
            this.logger.error('Retry also failed:', retryError.message);
            throw retryError;
          }
        }
      }
      
      throw error;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  // Enhanced health check with connection validation
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.pool.query('SELECT NOW() as current_time, version() as pg_version');
      this.logger.debug(`Health check successful. DB time: ${result.rows[0].current_time}`);
      return true;
    } catch (error) {
      this.logger.error('Database health check failed', {
        message: error.message,
        code: error.code,
        poolStats: this.getPoolStats()
      });
      return false;
    }
  }

  // Enhanced connection pool stats
  getPoolStats() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
      maxConnections: this.pool.options.max,
      minConnections: this.pool.options.min,
    };
  }

  // Add method to gracefully handle connection issues
  async reconnect(): Promise<void> {
    this.logger.log('Attempting to reconnect to database...');
    try {
      await this.pool.end();
      // The pool will automatically reconnect on next query
      const isHealthy = await this.healthCheck();
      if (isHealthy) {
        this.logger.log('Database reconnection successful');
      } else {
        this.logger.error('Database reconnection failed');
      }
    } catch (error) {
      this.logger.error('Error during reconnection:', error.message);
    }
  }

  async onModuleDestroy() {
    this.logger.log('Closing PostgreSQL connection pool...');
    try {
      await this.pool.end();
      this.logger.log('PostgreSQL connection pool closed successfully');
    } catch (error) {
      this.logger.error('Error closing PostgreSQL connection pool:', error.message);
    }
  }
}