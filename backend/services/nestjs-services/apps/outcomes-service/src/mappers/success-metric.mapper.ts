import {SuccessMetric} from "@app/common/types/outcomes_service/v1/models";

export class SuccessMetricMapper {
    static toProtoSuccessMetric(metric: any): SuccessMetric {
        return {
            id: metric.id,
            outcome_id: metric.outcome_id,
            metric_name: metric.metric_name,
            target_value: metric.target_value,
            current_value: metric.current_value,
            unit: metric.unit,
            description: metric.description,
            created_at: this.toTimestamp(metric.created_at),
            updated_at: this.toTimestamp(metric.updated_at),
            outcome: metric.outcome,
        };
    }

    static toTimestamp(date: Date): any {
        if (!date) return undefined;
        return {
            seconds: Math.floor(date.getTime() / 1000),
            nanos: (date.getTime() % 1000) * 1000000,
        };
    }
}
