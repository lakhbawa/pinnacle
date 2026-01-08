export interface KafkaHeaders {
    'trace-id': string;
    'correlation-id': string;
    'causation-id'?: string;
    'timestamp': string;
    [key: string]: string | undefined;
}

export interface KafkaEnvelope<T = any> {
    eventType: string;
    version: string;
    timestamp: string;
    source: string;
    data: T;
}

export interface OutcomeCreatedEvent {
    outcomeId: string;
    userId: string;
    title: string
}

export interface NotificationRequestEvent {
  recipientIds: string[];
  templateCode: string;
  data: Record<string, any>;
  channels: ('in_app' | 'email' | 'push')[];
}