// src/common/logger/logger.service.ts
import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    const logLevel = process.env.LOG_LEVEL || 'info'; // Default to 'info' if not specified

    this.logger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaString =
            meta && Object.keys(meta).length
              ? JSON.stringify(meta, null, 2) // Format metadata as pretty-printed JSON
              : '';
          return `${timestamp} [${level}]: ${message} ${metaString}`;
        }),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(), // Colorize for better readability in console
            winston.format.simple(),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    });
  }

  log(message: string, metadata?: Record<string, any>) {
    this.logger.info(message, { metadata });
  }
  info(message: string, metadata?: Record<string, any>) {
    this.logger.info(message, { metadata });
  }
  error(message: string, metadata?: Record<string, any>) {
    this.logger.error(message, { metadata });
  }
  warn(message: string, metadata?: Record<string, any>) {
    this.logger.warn(message, { metadata });
  }
  debug(message: string, metadata?: Record<string, any>) {
    this.logger.debug(message, { metadata });
  }
  verbose(message: string, metadata?: Record<string, any>) {
    this.logger.verbose(message, { metadata });
  }
}
