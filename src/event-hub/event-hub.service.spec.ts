import { Test, TestingModule } from '@nestjs/testing';
import { EventHubConsumerService } from './event-hub-consumer.service';

describe('EventHubService', () => {
  let service: EventHubConsumerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventHubConsumerService],
    }).compile();

    service = module.get<EventHubConsumerService>(EventHubConsumerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
