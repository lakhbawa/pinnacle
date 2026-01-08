import { Module } from '@nestjs/common';
import {KafkaModule} from "@app/common/kafka/src/kafka.module";
import {ConfigModule} from "@nestjs/config";
import {NotificationConsumer} from "./notifications.consumer";
import {NotificationsService} from "./notifications/notifications.service";
import {EmailService} from "./channels/email.service";
import appConfig from "@app/common/config/app.config";
import {NotificationsModule} from "./notifications/notifications.module";

@Module({
  imports: [
            ConfigModule.forRoot({
      isGlobal: true,  // Makes ConfigModule available everywhere
      envFilePath: 'apps/notifications-service/.env',
        load: [appConfig],
    }),
      KafkaModule,
      NotificationsModule
  ],
  controllers: [],
  providers: [
      NotificationConsumer,
      NotificationsService,
      EmailService
  ],
})
export class NotificationsServiceModule {}
