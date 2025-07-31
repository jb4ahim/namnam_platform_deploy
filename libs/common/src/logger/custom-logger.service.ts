import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { Logger as NestLogger } from '@nestjs/common';

export interface LogContext {
  userId?: string;
  requestId?: string;
  method?: string;
  url?: string;
  ip?: string;
  userAgent?: string;
  [key: string]: any;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  timestamp: string;
  extra?: LogContext;
}

@Injectable()
export class CustomLoggerService extends NestLogger implements LoggerService {
  private logEntries: LogEntry[] = [];
  private readonly maxEntries = 1000; // Keep last 1000 entries in memory

  constructor(context?: string) {
   super(context || '');
  }

  log(message: any, context?: string, extra?: LogContext) {
    this.writeLog('log', message, context, extra);
    super.log(message, context);
  }

  error(message: any, trace?: string, context?: string, extra?: LogContext) {
    this.writeLog('error', message, context, { ...extra, trace });
    super.error(message, trace, context);
  }

  warn(message: any, context?: string, extra?: LogContext) {
    this.writeLog('warn', message, context, extra);
    super.warn(message, context);
  }

  debug(message: any, context?: string, extra?: LogContext) {
    this.writeLog('debug', message, context, extra);
    super.debug(message, context);
  }

  verbose(message: any, context?: string, extra?: LogContext) {
    this.writeLog('verbose', message, context, extra);
    super.verbose(message, context);
  }

  // Custom methods for structured logging
  logRequest(method: string, url: string, statusCode: number, responseTime: number, extra?: LogContext) {
    const message = `${method} ${url} ${statusCode} - ${responseTime}ms`;
    this.log(message, 'HTTP', {
      ...extra,
      method,
      url,
      statusCode,
      responseTime,
    });
  }

  logUserAction(userId: string, action: string, resource?: string, extra?: LogContext) {
    const message = `User ${userId} performed ${action}${resource ? ` on ${resource}` : ''}`;
    this.log(message, 'UserAction', {
      ...extra,
      userId,
      action,
      resource,
    });
  }

  logError(error: Error, context?: string, extra?: LogContext) {
    this.error(error.message, error.stack, context, {
      ...extra,
      errorName: error.name,
      errorStack: error.stack,
    });
  }

  // Method to retrieve recent log entries (useful for debugging)
  getRecentLogs(count = 50): LogEntry[] {
    return this.logEntries.slice(-count);
  }

  // Method to clear log entries
  clearLogs(): void {
    this.logEntries = [];
  }

  private writeLog(level: LogLevel, message: any, context?: string, extra?: LogContext) {
    const logEntry: LogEntry = {
      level,
      message: typeof message === 'string' ? message : JSON.stringify(message),
      context,
      timestamp: new Date().toISOString(),
      extra,
    };

    this.logEntries.push(logEntry);

    // Keep only the most recent entries
    if (this.logEntries.length > this.maxEntries) {
      this.logEntries = this.logEntries.slice(-this.maxEntries);
    }

    // Here you could add logic to send logs to external services
    // this.sendToExternalLogger(logEntry);
  }

  // Extension point for external logging services
  protected async sendToExternalLogger(logEntry: LogEntry): Promise<void> {
    // Override this method in a subclass to send logs to external services
    // Examples: Winston, DataDog, CloudWatch, etc.
  }
}