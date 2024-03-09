/* eslint-disable prettier/prettier */
import { Injectable, ValidationError } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TempEvent } from './schemas/event.schema';
import { LoggerService } from 'src/logger/logger.service';


@Injectable()
export class EventService {

  constructor(private readonly logger: LoggerService,
    @InjectModel(Event.name) private eventModel: Model<TempEvent>) { }


  /**
   * Used to store events to the events collection in mongo db 
   * @param createEventDto 
   * @returns 
   */
  async create(createEventDto: CreateEventDto) {

    const createdEvent = new this.eventModel(createEventDto);
    // try {
    const result = await createdEvent.save();
    this.logger.log('A new event has been saved in DB', EventService.name);
    return result;
    // } catch (error) {
    //     this.logger.error(error.message, error, EventService.name)
    //     throw error
    // }


  }

  /**
   * Retrieve all the data from the event collection 
   */
  findAll() {
    return this.eventModel.find();
  }

  findOne(id: string) {
    return this.eventModel.findOne({
      engineId: id
    })
  }

  // update(id: number, updateEventDto: UpdateEventDto) {
  //   return `This action updates a #${id} event`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} event`;
  // }

  async validate(eventDto: CreateEventDto) {
    const createdEvent = new this.eventModel(eventDto);
    try {
      await createdEvent.validate();
    } catch (error) {
      this.logger.error(error.message, '', EventService.name)
      throw new Error(`Validation failed: ${error.message}` );
    }

  }
}
