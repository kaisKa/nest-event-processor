/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { CreateEventDto } from 'src/event/dto/create-event.dto';
import { EventHubProducerService } from './event-hub-producer.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('event-hub')
@Controller('event-hub')
export class EventHubController {

    constructor(private readonly producerService:EventHubProducerService){}

    @Post('send-event')
    sendEvent(@Body() createEventDto: [CreateEventDto]) {

        return " done ";
        // this.producerService.sendEvent(createEventDto);
    }
}
