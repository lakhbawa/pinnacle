import {KafkaConsumer} from "../kafka/kafka.consumer";
import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {KafkaModule} from "@app/common/kafka/src/kafka.module";
import {EmailService} from "../channels/email.service";
import { NotificationsService } from "./notifications.service";
import {TemplatesService} from "../templates/templates.service";
import {NotificationsGateway} from "./notifications.gateway";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        KafkaModule,
    ],
    providers: [
        KafkaConsumer,
        EmailService,
        NotificationsService,
        TemplatesService,
        NotificationsGateway
    ]
})

export class NotificationsModule {}