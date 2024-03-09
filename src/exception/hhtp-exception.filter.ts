/* eslint-disable prettier/prettier */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Request, Response } from 'express';
import { LoggerService } from "src/logger/logger.service";
@Catch(HttpException)
export class CustomeExceptionFileter implements ExceptionFilter {
    constructor(private readonly logger: LoggerService) { }
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const message = exception.message;
        // Log the exception
        this.logger.error(message, exception.trace, exception.name);

        response
            .status(status)
            .json({
                message: message,
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
    }
}
