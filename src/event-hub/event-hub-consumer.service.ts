/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { EventHubConsumerClient, RetryMode, RetryOptions, earliestEventPosition, latestEventPosition } from '@azure/event-hubs';
import { TempEvent } from 'src/event/schemas/event.schema';
import { ServiceBusService } from 'src/service-bus/service-bus.service';
import { TempEventHub } from './models/TempEventHub.model';
import { queues } from 'src/service-bus/enums/queue';
import { LoggerService } from 'src/logger/logger.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DefaultAzureCredential } from '@azure/identity';

@Injectable()
export class EventHubConsumerService implements OnModuleInit {

    private client: EventHubConsumerClient

    credential = new DefaultAzureCredential();

    private readonly EVENT_HUB_NAME = process.env.EVENT_HUB_NAME || "temprature-event-hub";
    private readonly EVENT_HUB_NAME_SPACE = process.env.EVENT_HUB_NAME_SPACE || "nest-eventhub.servicebus.windows.net";
    private readonly CONSUMER_GROUP = process.env.CONSUMER_GROUP || "$Default";



    constructor(private readonly logger: LoggerService,
        private readonly serviceBusService: ServiceBusService) {

        // Configure the retry options
        // const retryOptions = {
        //     maxRetries: 5,
        //     retryDelayInMs: 3000,
        //     maxRetryDelayInMs: 10000, 
        //     mode: RetryMode.Exponential, 
        // };
        this.client = new EventHubConsumerClient(this.CONSUMER_GROUP, this.EVENT_HUB_NAME_SPACE, this.EVENT_HUB_NAME, this.credential);

    }


    onModuleInit() {
        this.startListening()
    }

    /**
     * 1. Subscripe to the event hub 
     * 2. Listen to the events
     * 3. Send event processor method
     */
    async startListening() {
        try {
            // define the starting point
            const eventPosition = latestEventPosition

            // Subscribe to messages from all partitions


            const subscription = await this.client.subscribe(
                {

                    processEvents: async (events, context) => {
                        if (events.length === 0) {
                            this.logger.log(`No events received within wait time. Waiting for next interval`);
                            return;
                        }
                        for (const event of events) {

                            const myEvent: TempEventHub = event.body

                            this.logger.log(
                                `Received event: '${myEvent}' from partition: '${context.partitionId}' and consumer group: '${context.consumerGroup}'`, EventHubConsumerService.name);

                            this.processEvent(event);
                        }
                    },
                    processError: async (err, context) => {
                        this.logger.error(`Error on partition "${context.partitionId}": ${err}`, err.message, EventHubConsumerService.name);
                    },
                },
                { startPosition: latestEventPosition }
            );

            // Wait for a bit before cleaning up the sample
            // setTimeout(async () => {
            //     await subscription.close();
            //     await this.client.close();
            //     this.logger.log(`Exiting receiveEvents sample`, EventHubConsumerService.name);
            // }, 30 * 1000);
        } catch (error) {
            this.logger.error('Error occurred while starting to listen to events:', error, EventHubConsumerService.name);
        }




    }


    /**
     * 1. check the tempreture 
     * 2. in case it is below 30 degree -> send to norrmal temp queue 
     * 3. in case it is above 30 and less than 80 -> send to high temp queue 
     * 4. in case it is above 80 -> send to critical temp queue 
     * @param event 
     */
    async processEvent(event: any): Promise<void> {
        try {

            this.logger.log(`Processing event from Event Hub: ${JSON.stringify(event)}`, EventHubConsumerService.name);


            const temp: TempEventHub = JSON.parse(JSON.stringify(event.body));
            if (temp.temperature <= 30) {
                // Send the event to the appropriate Service Bus queue
                await this.serviceBusService.sendMessageToQueue(queues.NORMAL, event);
                this.logger.log(`Event sent to ${queues.NORMAL} queue after processing`, EventHubConsumerService.name);
            }
            else if (temp.temperature > 30 && temp.temperature < 80) {
                await this.serviceBusService.sendMessageToQueue(queues.HIGH, event);
                this.logger.log(`Event sent to ${queues.HIGH} queue after processing`, EventHubConsumerService.name);

            } else {
                await this.serviceBusService.sendMessageToQueue(queues.CRITICAL, event);
                this.logger.log(`Event sent to ${queues.CRITICAL} queue after processing`, EventHubConsumerService.name);
            }
        } catch (error) {
            this.logger.error(`Error processing event from Event Hub: ${error.message}`, error, EventHubConsumerService.name);
            // Handle error as needed
        }
    }
}


