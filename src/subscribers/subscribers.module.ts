import { Module, ValidationPipe } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { SubscribersController } from './subscribers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscriber, SubscriberSchema } from './entities/subscriber.schema';
import { APP_PIPE } from '@nestjs/core';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      {
        name: Subscriber.name,
        schema: SubscriberSchema,
      },
    ]),
  ],
  controllers: [SubscribersController],
  providers: [
    SubscribersService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class SubscribersModule {}
