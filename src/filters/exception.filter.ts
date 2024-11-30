/**
 * @fileoverview Defines the last exception layer for the application
 * Handles HTTP exceptions as well as non-http exceptions
 * Transforms the error object to the required DTO
 * Logs the error in case the error is an Internal Server Error
 */
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    HttpExceptionBody,
    Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { isString } from 'class-validator';

import { APIErrorResponse } from 'src/types/common.dto';
import { isEmptyValue } from 'src/utils';

@Catch()
export class CatchEveryErrorFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    private readonly logger = new Logger(CatchEveryErrorFilter.name, {
        timestamp: true,
    });

    private getExceptionDetails(
        exception: HttpException,
    ): undefined | string[] {
        const exceptionDetails = exception.getResponse() as HttpExceptionBody;
        const exceptionMessage = exceptionDetails.message;

        if (isEmptyValue(exceptionMessage)) return;

        if (isString(exceptionMessage)) return [exceptionMessage];

        return exceptionMessage;
    }

    catch(exception: unknown, host: ArgumentsHost): void {
        // In certain situations `httpAdapter` might not be available in the
        // constructor method, thus we should resolve it here.
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();

        // Unhandled non-http errors
        let errorStack = '';
        const responseBody: APIErrorResponse = {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            title: 'Internal Server Error',
            type: 'InternalServerException',
        };

        // http exceptions
        if (exception instanceof HttpException) {
            responseBody.statusCode = exception.getStatus();
            responseBody.title = exception.message;
            responseBody.type = exception.name;

            const exceptionDetails = this.getExceptionDetails(exception);
            if (exceptionDetails) responseBody.details = exceptionDetails;

            errorStack = exception.stack || '';
        }

        // Add logging for internal server errors
        if (responseBody.statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(responseBody.title, errorStack);
        }

        httpAdapter.reply(
            ctx.getResponse(),
            responseBody,
            responseBody.statusCode,
        );
    }
}
