import { AsyncLocalStorage} from 'async_hooks'
import { v4 as uuidv4 } from 'uuid';
export interface TraceContext {
    traceId: string,
    correlationId: string,
    causationId?: string
}

export const traceStorage = new AsyncLocalStorage<TraceContext>();

export function getTraceContext(): TraceContext {
    return traceStorage.getStore() || {
        traceId: uuidv4(),
        correlationId: uuidv4()
    };
}

export function runWithTraceContext<T>(context: TraceContext, fn: () => T) : T {
    return traceStorage.run(context, fn)
}

export function generateTraceId(): string {
    return uuidv4();
}