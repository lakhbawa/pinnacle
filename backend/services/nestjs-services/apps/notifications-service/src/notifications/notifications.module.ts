import {NotificationConsumer} from "../notifications.consumer";
import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {KafkaModule} from "@app/common/kafka/src/kafka.module";
import {EmailService} from "../channels/email.service";
import { NotificationsService } from "./notifications.service";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        KafkaModule,
    ],
    providers: [
        NotificationConsumer,
        EmailService,
        NotificationsService
    ]
})

export class NotificationsModule {}