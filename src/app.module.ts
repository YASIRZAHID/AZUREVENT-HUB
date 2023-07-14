import { Module } from '@nestjs/common';
import { ProducerController } from './producer/producer.controller';
import { ConsumerController } from './consumer/consumer.controller';

@Module({
  imports: [],
  controllers: [ProducerController, ConsumerController],
  providers: [],
})
export class AppModule {}
