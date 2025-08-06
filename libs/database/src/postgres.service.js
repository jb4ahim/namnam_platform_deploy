"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PostgresService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let PostgresService = PostgresService_1 = class PostgresService {
    pool;
    logger = new common_1.Logger(PostgresService_1.name);
    constructor() {
        let config;
        if (process.env.DATABASE_URL) {
            this.logger.log('Using DATABASE_URL connection string');
            config = {
                connectionString: process.env.DATABASE_URL,
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
            };
        }
        else {
            this.logger.log('Using individual database environment variables');
            config = {
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT || '5432'),
                database: process.env.DB_DATABASE,
                user: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
            };
            const requiredVars = ['DB_HOST', 'DB_DATABASE', 'DB_USERNAME', 'DB_PASSWORD'];
            const missingVars = requiredVars.filter(varName => !process.env[varName]);
            if (missingVars.length > 0) {
                throw new Error(`Missing required database environment variables: ${missingVars.join(', ')}`);
            }
            this.logger.log(`Connecting to PostgreSQL at ${config.host}:${config.port}/${config.database}`);
        }
        config = {
            ...config,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
            acquireTimeoutMillis: 60000,
        };
        this.pool = new pg_1.Pool(config);
        this.pool.on('error', (err) => {
            this.logger.error('Unexpected error on idle client', err);
        });
        this.pool.on('connect', () => {
            this.logger.debug('New client connected to PostgreSQL');
        });
    }
    async query(sql, params) {
        try {
            const res = await this.pool.query(sql, params);
            return res.rows;
        }
        catch (error) {
            throw error;
        }
    }
    async healthCheck() {
        try {
            await this.pool.query('SELECT 1');
            return true;
        }
        catch (error) {
            this.logger.error('Database health check failed', error);
            return false;
        }
    }
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
};
exports.PostgresService = PostgresService;
exports.PostgresService = PostgresService = PostgresService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PostgresService);
//# sourceMappingURL=postgres.service.js.map