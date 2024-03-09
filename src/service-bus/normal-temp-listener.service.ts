/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from "@nestjs/common";
import { ServiceBusService } from "./service-bus.service";
import { EventService } from "src/event/event.service";
import { CreateEventDto } from "src/event/dto/create-event.dto";
import { queues } from "./enums/queue";
import { ServiceBusReceivedMessage } from "@azure/service-bus";
import { LoggerService } from "src/logger/logger.service";
@Injectable()
export class NormalTempratureConsumerService implements OnModuleInit {
    private readonly queueName = process.env.NORMAL_QUEUE_NAME || queues.NORMAL;

    constructor(private readonly logger: LoggerService,
        private readonly eventService: EventService,
        private readonly serviceBusService: ServiceBusService) { }

    onModuleInit() {
        this.startListening();
    }

    /**
     * Use the ServiceBusService to subscribe to a normal-temrature-queue
     */
    async startListening(): Promise<void> {
        try {
            // subscribe to message from high-temprature queue
            this.serviceBusService.subscribeToQueue(this.queueName, this.processMessage.bind(this))
            this.logger.log(`Listening to ${this.queueName} events `, NormalTempratureConsumerService.name)
        } catch (error) {
            this.logger.error(`Error ocured while listening to ${this.queueName} events : ${error}`, error, NormalTempratureConsumerService.name)
        }
    }

    /**
     * Process the messages, then store theme in mongo db 
     * @param message 
     */
    async processMessage(message: ServiceBusReceivedMessage): Promise<void> {
        try {
            const jsonMessage = JSON.stringify(message.body);
            this.logger.log(`Received message from ${this.queueName} queue: ${jsonMessage}`, NormalTempratureConsumerService.name);
            const model: CreateEventDto = JSON.parse(jsonMessage)[0];

            this.eventService.validate(model);
            this.eventService.create(model);

        } catch (error) {
            this.logger.error(`Error occurred while processing message from ${this.queueName} queue: ${error.message}`, error, NormalTempratureConsumerService.name);
        }
    }

}