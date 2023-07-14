import { Controller, Get } from '@nestjs/common';
import {
  EventHubConsumerClient,
  earliestEventPosition,
} from '@azure/event-hubs';

@Controller('consumer')
export class ConsumerController {
  private eventHubClient: EventHubConsumerClient;

  constructor() {
    this.eventHubClient = new EventHubConsumerClient(
      process.env.EVENT_HUB_CONNECTION_STRING,
      process.env.EVENT_HUB_NAME,
      process.env.EVENT_HUB_CONSUMER_GROUP || '$Default',
    );
  }

  @Get()
  async receiveMessages(): Promise<any> {
    const partitionIds = await this.eventHubClient.getPartitionIds();
    const messages = [];

    for (const partitionId of partitionIds) {
      const subscriptionOptions = {
        startPosition: earliestEventPosition,
      };

      const subscription = this.eventHubClient.subscribe(
        partitionId,
        {
          processEvents: async (events, context) => {
            // event processing code goes here
            messages.push(...events);
          },
          processError: async (err, context) => {
            // error reporting/handling code here
            console.log(
              `Errors in subscription to partition ${context.partitionId}: ${err}`,
            );
          },
        },
        subscriptionOptions,
      );

      // Wait for a few seconds to receive events before closing the subscription
      await new Promise((resolve) => setTimeout(resolve, 3000));

      await subscription.close();
    }

    await this.eventHubClient.close();
    console.log('Exiting sample');

    return messages.map((message) => message.body);
  }
}
