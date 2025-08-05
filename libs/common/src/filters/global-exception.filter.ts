import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status: number;
    let message: string | object = 'Internal server error'; // Initialize with default
    let errorDetails: any = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
        // Capture additional details from the exception response
        errorDetails = {
          ...exceptionResponse,
          originalError: exception.name,
        };
      }
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
      
      // Extract detailed error information
      errorDetails = {
        name: exception.name,
        originalError: exception.constructor.name,
        // Include stack trace only in development
        ...(process.env.NODE_ENV === 'development' && {
          stack: exception.stack,
        }),
      };

      // Handle AggregateError (common with database connection issues)
      if (exception.name === 'AggregateError' && 'errors' in exception) {
        const aggregateError = exception as any;
        errorDetails.aggregateErrors = aggregateError.errors?.map((err: any) => ({
          name: err.name,
          message: err.message,
          code: err.code,
          errno: err.errno,
          syscall: err.syscall,
          address: err.address,
          port: err.port,
          ...(err.detail && { detail: err.detail }),
          ...(err.hint && { hint: err.hint }),
          ...(err.where && { where: err.where }),
        }));
        
        // Use the first error's message if available
        if (aggregateError.errors?.[0]?.message) {
          message = `${exception.message}: ${aggregateError.errors[0].message}`;
        }
      }

      // Handle PostgreSQL errors specifically
      if (exception.name === 'error' || 'code' in exception) {
        const pgError = exception as any;
        errorDetails.databaseError = {
          code: pgError.code,
          detail: pgError.detail,
          hint: pgError.hint,
          position: pgError.position,
          internalPosition: pgError.internalPosition,
          internalQuery: pgError.internalQuery,
          where: pgError.where,
          schema: pgError.schema,
          table: pgError.table,
          column: pgError.column,
          dataType: pgError.dataType,
          constraint: pgError.constraint,
          file: pgError.file,
          line: pgError.line,
          routine: pgError.routine,
          severity: pgError.severity,
        };
      }

      // Handle connection errors
      if (exception.message.includes('ECONNREFUSED') || exception.message.includes('connect')) {
        errorDetails.connectionError = {
          type: 'DATABASE_CONNECTION_REFUSED',
          suggestion: 'Check if the database server is running and accessible',
          possibleCauses: [
            'Database server is not running',
            'Incorrect connection parameters',
            'Network connectivity issues',
            'Firewall blocking the connection'
          ]
        };
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      errorDetails = {
        originalError: 'Unknown error type',
        details: String(exception),
      };
    }

    // Log the full error for debugging
    this.logger.error(
      `Exception caught: ${message}`,
      exception instanceof Error ? exception.stack : String(exception),
      {
        url: request.url,
        method: request.method,
        body: request.body,
        params: request.params,
        query: request.query,
        errorDetails: errorDetails, // Include all extracted error details
        // For AggregateError, log the individual errors
        ...(exception instanceof Error && exception.name === 'AggregateError' && 'errors' in exception && {
          individualErrors: (exception as any).errors?.map((err: any, index: number) => ({
            index,
            name: err.name,
            message: err.message,
            code: err.code,
            stack: err.stack
          }))
        })
      }
    );

    const errorResponse = {
      success: false,
      statusCode: status,
      message: typeof message === 'string' ? message : (message as any).message || message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      // Include the detailed error information
      error: {
        type: exception instanceof Error ? exception.constructor.name : typeof exception,
        details: errorDetails,
        // Include validation errors if they exist
        ...(errorDetails.errors && { validationErrors: errorDetails.errors }),
      },
      // Only include sensitive debugging info in development
      ...(process.env.NODE_ENV === 'development' && {
        requestInfo: {
          body: request.body,
          params: request.params,
          query: request.query,
          headers: request.headers,
        },
      }),
    };

    response.status(status).send(errorResponse);
  }
}