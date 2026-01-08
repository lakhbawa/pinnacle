import {Injectable, Logger, OnModuleInit} from "@nestjs/common";
import {KafkaService} from "@app/common/kafka/src/kafka.service";
import {OutcomesService} from "./outcomes/outcomes.service";
import {TraceContext} from "@app/common/kafka/src/tracing/tracing.context";

@Injectable()
export class OutcomesConsumer implements OnModuleInit {
    private readonly logger = new Logger(OutcomesConsumer.name)

    constructor(private kafkaService: KafkaService,
                private outcomesService: OutcomesService) {}

    async onModuleInit() {
        await this.kafkaService.subscribe(
            'outcomes-service-group',
            ['outcomes-events'],
            this.handleEvent.bind(this)
        )
    }

    private async handleEvent(eventType: string,
                              data: any,
                              context: TraceContext): Promise<void> {
        this.logger.log({
            message: "Processing Event",
            eventType,
            traceId: context.traceId,
            correlationId: context.correlationId
        });

        switch(eventType) {
            case "UNKNOW_EVENT":
                await this.outcomesService.count({})
                break
            default:
                this.logger.warn(`Unhandled event type: ${eventType}`)
        }
    }
}