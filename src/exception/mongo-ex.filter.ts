/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { ArgumentsHost, Catch, ConflictException, ExceptionFilter, HttpStatus, ValidationError } from '@nestjs/common';
import { Request, Response } from 'express';
import { MongooseError } from 'mongoose';
import { LoggerService } from 'src/logger/logger.service';

@Catch(MongooseError)
export class MongoExceptionFilter implements ExceptionFilter {
    constructor(private readonly logger: LoggerService) { }
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const message = exception.message;

        // Log the exception
        this.logger.error(message, exception.trace, exception.name);
        response
            .status(HttpStatus.BAD_REQUEST)
            .json({
                message: message,
                statusCode: HttpStatus.BAD_REQUEST,
                timestamp: new Date().toISOString(),
                path: request.url,
            });


    }
}