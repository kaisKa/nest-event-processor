/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './schemas/event.schema';
import { LoggerService } from 'src/logger/logger.service';


@Module({
  imports: [MongooseModule.forFeature([{name: Event.name, schema: EventSchema}])],
  controllers: [EventController],
  providers: [EventService, LoggerService],
  exports:[EventService,MongooseModule.forFeature([{name: Event.name, schema: EventSchema}])]
})
export class EventModule {}
