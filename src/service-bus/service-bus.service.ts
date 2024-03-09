/* eslint-disable prettier/prettier */
import { DefaultAzureCredential } from '@azure/identity';
import { ProcessErrorArgs, ServiceBusClient, ServiceBusReceivedMessage } from '@azure/service-bus';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ServiceBusService {
    private readonly logger = new Logger(ServiceBusService.name);
    private readonly serviceBusClient: ServiceBusClient;

    private readonly SERVICE_BUS_NAMESPACE = process.env.SERVICE_BUS_NAMESPACE || 'nest-busservice.servicebus.windows.net';
    credential = new DefaultAzureCredential();



    constructor() {
        this.serviceBusClient = new ServiceBusClient(this.SERVICE_BUS_NAMESPACE, this.credential);
    }

    /**
     * To send message to a queue in a azure service bus
     * 1. Create a sender to service bus by providing the  name of the queue
     * 2. Send the message to the specified queue 
     * 3. Close the sender
     * @param queueName 
     * @param message 
     */
    async sendMessageToQueue(queueName: string, message: any) {
        try {
            const sender = this.serviceBusClient.createSender(queueName);
            await sender.sendMessages({ body: message });
            await sender.close();

            this.logger.log(`Message sent to ${queueName} queue: ${JSON.stringify(message)}`);
        } catch (error) {
            this.logger.error(`Error ocured while sending to ${queueName} queue: ${error.message}`)
            throw error;
        }
    }


    /**
     * To subscribe to a spicific queue in Azure service bus 
     * 1. Create receiver to receive message by providing the queueu name, the receive moode is 'peeklock'
     * 2. Use the receiver to suscribe, provideng the message and the error handler 
     * 3. Invoke the callback message processor 
     * 4. close the reciever.
     * 
     * @param queueName 
     * @param processMessage 
     */
    async subscribeToQueue(queueName: string, processMessage: (message: any) => Promise<void>): Promise<void> {
        try {
            const receiver = this.serviceBusClient.createReceiver(queueName, {
                receiveMode: 'peekLock',
            });

            const messageHandler = async (message: ServiceBusReceivedMessage) => {
                try {
                    await processMessage(message.body);
                } catch (error) {
                    this.logger.error(`Error processing message from ${'queueName'} queue: ${error.message}`);
                }
            }

            const errorHandler = async (error: ProcessErrorArgs) => {
                this.logger.error(`Error occurred while receiving messages from ${queueName} queue: ${error}`);
            }

            // listen to the messages
            receiver.subscribe({
                processMessage: messageHandler,
                processError: errorHandler
            });

            //close the reciver 
            await receiver.close();


        } catch (error) {
            this.logger.error(`Error occurred while subscribing to ${queueName} queue: ${error.message}`);
            throw error;
        }



    }


}
