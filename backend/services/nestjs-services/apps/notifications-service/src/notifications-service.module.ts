import { Module } from '@nestjs/common';
import {KafkaModule} from "@app/common/kafka/src/kafka.module";
import {ConfigModule} from "@nestjs/config";
import {KafkaConsumer} from "./kafka/kafka.consumer";
import {NotificationsService} from "./notifications/notifications.service";
import {EmailService} from "./channels/email.service";
import appConfig from "@app/common/config/app.config";
import {NotificationsModule} from "./notifications/notifications.module";
import {ChannelsModule} from "./channels/channels.module";
import {PrismaModule} from "./prisma.module";
import {TemplatesModule} from "./templates/templates.module";
import {NotificationsGateway} from "./notifications/notifications.gateway";

@Module({
  imports: [
            ConfigModule.forRoot({
      isGlobal: true,  // Makes ConfigModule available everywhere
      envFilePath: 'apps/notifications-service/.env',
        load: [appConfig],
    }),
      PrismaModule,
      KafkaModule,
      ChannelsModule,
      TemplatesModule,
      NotificationsModule
  ],
  controllers: [],
  providers: [
      KafkaConsumer,
      NotificationsService,
      EmailService,
        NotificationsGateway

  ],
})
export class NotificationsServiceModule {}
