/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { EventHubConsumerService } from './event-hub-consumer.service';
import { EventHubController } from './event-hub.controller';
import { EventHubProducerService } from './event-hub-producer.service';
import { ServiceBusService } from 'src/service-bus/service-bus.service';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  imports:[EventHubModule],
  providers: [LoggerService,EventHubConsumerService, EventHubProducerService, ServiceBusService],
  controllers: [EventHubController]
  
})
export class EventHubModule {}
