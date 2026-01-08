import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import {NotificationsService} from "./notifications/notifications.service";
import {KafkaService} from "@app/common/kafka/src/kafka.service";
import {TraceContext} from "@app/common/kafka/src/tracing/tracing.context";

@Injectable()
export class NotificationConsumer implements OnModuleInit {
  private readonly logger = new Logger(NotificationConsumer.name);

  constructor(
    private kafkaService: KafkaService,
    private notificationService: NotificationsService,
  ) {}

  async onModuleInit() {
    await this.kafkaService.subscribe(
      'notification-service-group',
      ['outcomes-events'],
      this.handleEvent.bind(this),
    );
  }

  private async handleEvent(
    eventType: string,
    data: any,
    context: TraceContext,
  ): Promise<void> {
    this.logger.log({
      message: 'Processing notification event',
      eventType,
      traceId: context.traceId,
      correlationId: context.correlationId,
    });

    switch (eventType) {


      case 'OUTCOME_CREATED':
        // await this.notificationService.sendWelcomeNotification(data);
          this.logger.warn('OUTCOME_CREATED');
        break;

      default:
        this.logger.debug(`Ignoring event type: ${eventType}`);
    }
  }
}