/* eslint-disable prettier/prettier */
import { CreateBatchOptions, EventHubProducerClient } from '@azure/event-hubs';
import { DefaultAzureCredential } from '@azure/identity';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class EventHubProducerService {
    private producerClient: EventHubProducerClient;

    credential = new DefaultAzureCredential();

    private readonly EVENT_HUB_NAME = process.env.EVENT_HUB_NAME || "temprature-event-hub";
    private readonly EVENT_HUB_NAME_SPACE = process.env.EVENT_HUB_NAME_SPACE || "nest-eventhub.servicebus.windows.net";
    private readonly CONSUMER_GROUP = process.env.CONSUMER_GROUP || "$Default";

    constructor(private readonly logger: LoggerService) {
        this.producerClient = new EventHubProducerClient(this.EVENT_HUB_NAME_SPACE, this.EVENT_HUB_NAME, this.credential);
    }

    batchOptions: CreateBatchOptions = {
        // maxSizeInBytes: 262144
        maxSizeInBytes: 200

    }


    // sending batch
    async sendEvent(data: [any]) {
        try {
            let  batch = await this.producerClient.createBatch(this.batchOptions)

            let numEventsSent = 0;

            let i = 0;

            while (i < data.length) {
                const eventData = { body: data[i] };
                const isAdded = batch.tryAdd(eventData);

                if (isAdded) {
                    this.logger.log(`Added eventsToSend[${i}] to the batch`, EventHubProducerService.name);
                    ++i;
                    continue;
                }

                if (batch.count === 0) {
                    this.logger.log(`Message was too large and can't be sent until it's made smaller. Skipping...`, EventHubProducerService.name);
                    ++i;
                    continue;
                }

                this.logger.log(`Batch is full - sending ${batch.count} messages as a single batch.`, EventHubProducerService.name);
                await this.producerClient.sendBatch(batch);
                numEventsSent += batch.count;
                
                // create new batch for the for the next set of messages
                batch = await this.producerClient.createBatch(this.batchOptions);

            }

            if (batch.count > 0) {
                this.logger.log(`Sending remaining ${batch.count} messages as a single batch.`, EventHubProducerService.name);
                await this.producerClient.sendBatch(batch);
                numEventsSent += batch.count;
            }
            this.logger.log(`Sent ${numEventsSent} events`, EventHubProducerService.name);

            if (numEventsSent !== data.length) {
                throw new Error(`Not all messages were sent (${numEventsSent}/${data.length})`);
            }


        } catch (error) {
            this.logger.error('Error occurred while sending event:', error, EventHubProducerService.name);
            await this.producerClient.close();
            this.logger.log(`Exiting sendEvents sample`, EventHubProducerService.name);
        }

       

    }

}
