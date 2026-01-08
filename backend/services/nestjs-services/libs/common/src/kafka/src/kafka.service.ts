import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Consumer, EachMessagePayload, Kafka, Producer } from "kafkajs";
import { ConfigService } from "@nestjs/config";
import { generateTraceId, getTraceContext, runWithTraceContext, TraceContext } from "./tracing/tracing.context";
import { KafkaEnvelope, KafkaHeaders } from "./interfaces/kafka-message.interface";

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(KafkaService.name);
    private readonly kafka: Kafka;
    private readonly producer: Producer;
    private readonly clientId: string;
    private consumers: Map<string, Consumer> = new Map();

    constructor(private configService: ConfigService) {

        console.log('KAFKA_CLIENT_ID:', this.configService.get('KAFKA_CLIENT_ID'));
    console.log('KAFKA_BROKERS:', this.configService.get('KAFKA_BROKERS'));

        const clientId = this.configService.get<string>('KAFKA_CLIENT_ID');
        const brokers = this.configService.get<string>('KAFKA_BROKERS');

        if (!clientId) {
            throw new Error('KAFKA_CLIENT_ID is not defined in environment');
        }
        if (!brokers) {
            throw new Error('KAFKA_BROKERS is not defined in environment');
        }

        this.clientId = clientId;

        this.kafka = new Kafka({
            clientId: clientId,
            brokers: brokers.split(','),
            retry: {
                initialRetryTime: 100,
                retries: 8
            }
        });

        this.producer = this.kafka.producer({
            idempotent: true
        });
    }

    async onModuleInit() {
        await this.producer.connect();
        this.logger.log("Kafka Producer connected");
    }

    async onModuleDestroy() {
        await this.producer.disconnect();
        for (const consumer of this.consumers.values()) {
            await consumer.disconnect();
        }
        this.logger.log("Kafka connections closed");
    }


    async publish<T>(
        topic: string,
        eventType: string,
        data: T,
        key?: string
    ): Promise<void> {
        const context = getTraceContext();

        const envelope: KafkaEnvelope<T> = {
            eventType,
            version: '1.0',
            timestamp: new Date().toISOString(),
            source: this.clientId,
            data
        };

        const headers: KafkaHeaders = {
            'trace-id': generateTraceId(),
            'correlation-id': context.correlationId,
            'causation-id': context.traceId,
            'timestamp': new Date().toISOString()
        };

        await this.producer.send({
            topic,
            messages: [
                {
                    key: key ?? null,
                    value: JSON.stringify(envelope),
                    headers: headers as Record<string, string>
                }
            ]
        });

        this.logger.log({
            message: 'Event Published',
            topic,
            eventType,
            correlationId: context.correlationId,
            newTraceId: headers['trace-id']
        });
    }

    async publishBatch<T>(
        topic: string,
        events: Array<{ eventType: string; data: T; key?: string }>
    ): Promise<void> {
        const context = getTraceContext();

        const messages = events.map((event) => ({
            key: event.key ?? null,
            value: JSON.stringify({
                eventType: event.eventType,
                version: '1.0',
                timestamp: new Date().toISOString(),
                source: this.clientId,
                data: event.data
            }),
            headers: {
                'trace-id': generateTraceId(),
                'correlation-id': context.correlationId,
                'causation-id': context.traceId,
                'timestamp': new Date().toISOString()
            }
        }));

        await this.producer.send({ topic, messages });
    }


    async subscribe(
        groupId: string,
        topics: string[],
        handler: (
            eventType: string,
            data: any,
            context: TraceContext
        ) => Promise<void>
    ): Promise<void> {
        const consumer = this.kafka.consumer({
            groupId,
            sessionTimeout: 30000,
            heartbeatInterval: 3000
        });

        await consumer.connect();

        for (const topic of topics) {
            await consumer.subscribe({ topic, fromBeginning: false });
        }

        // Fix 3: Move this BEFORE consumer.run()
        this.consumers.set(groupId, consumer);
        this.logger.log(`Consumer ${groupId} subscribed to: ${topics.join(', ')}`);

        await consumer.run({
            eachMessage: async (payload: EachMessagePayload) => {
                const { topic, partition, message } = payload;

                // Fix 4: Safely extract headers with fallbacks
                const traceId = message.headers?.['trace-id']?.toString() || generateTraceId();
                const correlationId = message.headers?.['correlation-id']?.toString() || generateTraceId();
                const causationId = message.headers?.['causation-id']?.toString();

                const traceContext: TraceContext = {
                    traceId,
                    correlationId,
                    causationId
                };

                await runWithTraceContext(traceContext, async () => {
                    try {
                        // Fix 5: Handle null message.value
                        if (!message.value) {
                            this.logger.warn({
                                message: 'Received message with null value',
                                topic,
                                partition,
                                traceId: traceContext.traceId
                            });
                            return;
                        }

                        const envelope: KafkaEnvelope = JSON.parse(message.value.toString());

                        this.logger.log({
                            message: 'Event Received',
                            topic,
                            partition,
                            eventType: envelope.eventType,
                            traceId: traceContext.traceId,
                            correlationId: traceContext.correlationId
                        });

                        await handler(envelope.eventType, envelope.data, traceContext);

                    } catch (error) {
                        this.logger.error({
                            message: 'Error processing event',
                            topic,
                            partition,
                            error: error instanceof Error ? error.message : 'Unknown error',
                            traceId: traceContext.traceId,
                            correlationId: traceContext.correlationId
                        });

                        // Rethrow to trigger Kafka retry mechanism
                        throw error;
                    }
                });
            }
        });
    }
}