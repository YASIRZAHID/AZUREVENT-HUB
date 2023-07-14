import { Controller, Get } from '@nestjs/common';
import { EventHubProducerClient } from '@azure/event-hubs';
import * as dotenv from 'dotenv';
dotenv.config();

@Controller('producer')
export class ProducerController {
  private eventHubClient: EventHubProducerClient;

  constructor() {
    this.eventHubClient = new EventHubProducerClient('Endpoint=sb://azuredemotest.servicebus.windows.net/;SharedAccessKeyName=mysender;SharedAccessKey=IiFR6xZSWoreoQDmvDpGBxly3Uyt8QVru+AEhAUB084=;EntityPath=demoeventhub', 'demoeventhub');
  }

  @Get()
  async sendMessage(): Promise<string> {
    const eventData = { message: 'Hello from the producer' };
    await this.eventHubClient.sendBatch([{ body: JSON.stringify(eventData) }]);
    return 'Message sent';
  }
}
