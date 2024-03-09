/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ServiceBusService } from './service-bus.service';
import { NormalTempratureConsumerService } from './normal-temp-listener.service';
import { HighTempratureConsumerService } from './high-temp-listener.service';
import { CriticalTempratureConsumerService } from './critical-temp-listener.service';
import { EventService } from 'src/event/event.service';
import { EventModule } from 'src/event/event.module';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  imports:[EventModule],
  providers: [LoggerService,ServiceBusService, NormalTempratureConsumerService, HighTempratureConsumerService, CriticalTempratureConsumerService, EventService],
  exports: [ServiceBusService]
})
export class ServiceBusModule { }
