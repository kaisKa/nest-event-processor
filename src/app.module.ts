/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoDbConfigModule } from './mongo-db-config/mongo-db-config.module';
import { EventModule } from './event/event.module';
import { EventHubModule } from './event-hub/event-hub.module';
import { ServiceBusModule } from './service-bus/service-bus.module';
import { EventHubProducerService } from './event-hub/event-hub-producer.service';
import { ExceptionModule } from './exception/exception.module';
import { LoggerModule } from './logger/logger.module';
import { LoggerService } from './logger/logger.service';
import { APP_FILTER } from '@nestjs/core';
import { CustomeExceptionFileter } from './exception/hhtp-exception.filter';

@Module({
  imports: [MongoDbConfigModule, MongoDbConfigModule, EventModule, EventHubModule, ServiceBusModule, ExceptionModule, LoggerModule],
  controllers: [AppController],
  providers: [AppService, EventHubProducerService, LoggerService,
    {
      provide: APP_FILTER,
      useClass: CustomeExceptionFileter,
    }],
  exports: [LoggerService]
})
export class AppModule { }
