"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GlobalExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let GlobalExceptionFilter = GlobalExceptionFilter_1 = class GlobalExceptionFilter {
    logger = new common_1.Logger(GlobalExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status;
        let message = 'Internal server error';
        let errorDetails = {};
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            }
            else if (typeof exceptionResponse === 'object') {
                message = exceptionResponse.message || exception.message;
                errorDetails = {
                    ...exceptionResponse,
                    originalError: exception.name,
                };
            }
        }
        else if (exception instanceof Error) {
            status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            message = exception.message;
            errorDetails = {
                name: exception.name,
                originalError: exception.constructor.name,
                ...(process.env.NODE_ENV === 'development' && {
                    stack: exception.stack,
                }),
            };
            if (exception.name === 'AggregateError' && 'errors' in exception) {
                const aggregateError = exception;
                errorDetails.aggregateErrors = aggregateError.errors?.map((err) => ({
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
                if (aggregateError.errors?.[0]?.message) {
                    message = `${exception.message}: ${aggregateError.errors[0].message}`;
                }
            }
            if (exception.name === 'error' || 'code' in exception) {
                const pgError = exception;
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
        }
        else {
            status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Internal server error';
            errorDetails = {
                originalError: 'Unknown error type',
                details: String(exception),
            };
        }
        this.logger.error(`Exception caught: ${message}`, exception instanceof Error ? exception.stack : String(exception), {
            url: request.url,
            method: request.method,
            body: request.body,
            params: request.params,
            query: request.query,
            errorDetails: errorDetails,
            ...(exception instanceof Error && exception.name === 'AggregateError' && 'errors' in exception && {
                individualErrors: exception.errors?.map((err, index) => ({
                    index,
                    name: err.name,
                    message: err.message,
                    code: err.code,
                    stack: err.stack
                }))
            })
        });
        const errorResponse = {
            success: false,
            statusCode: status,
            message: typeof message === 'string' ? message : message.message || message,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            error: {
                type: exception instanceof Error ? exception.constructor.name : typeof exception,
                details: errorDetails,
                ...(errorDetails.errors && { validationErrors: errorDetails.errors }),
            },
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
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = GlobalExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=global-exception.filter.js.map