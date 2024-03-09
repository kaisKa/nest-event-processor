/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, UseFilters } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { LoggerService } from 'src/logger/logger.service';
import { MongoExceptionFilter } from 'src/exception/mongo-ex.filter';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('events')
@Controller('event')
export class EventController {
  constructor(private readonly logger: LoggerService,
    private readonly eventService: EventService,) { }

  @UseFilters(MongoExceptionFilter)
  @Post()
  @ApiOperation({ summary: 'Save new event in events collection' })
  create(@Body() createEventDto: CreateEventDto) {

    return this.eventService.create(createEventDto);
  }



  @Get()
  @ApiOperation({ summary: 'List all events from event\'s collection' })
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve single event by engineId' })
  async findOne(@Param('id') id: string) {
     const res = await this.eventService.findOne(id);
     return res;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
  //   return this.eventService.update(+id, updateEventDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.eventService.remove(+id);
  // }
}
