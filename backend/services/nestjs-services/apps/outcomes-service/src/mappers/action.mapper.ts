import {Driver, Action} from "@app/common/types/outcomes_service/v1/models";

export class ActionMapper {
    static toProtoDriver(driver: any): Driver {
        return {
            id: driver.id,
            title: driver.title,
            outcome_id: driver.outcome_id,
            position: driver.position,
            created_at: this.toTimestamp(driver.created_at),
            actions: driver.actions?.map((t) => this.toProtoAction(t)) || [],
            outcome: driver.outcome,
        };
    }

    static toProtoAction(task: any): Action {
        return {
            id: task.id,
            driver_id: task.driver_id,
            outcome_id: task.outcome_id,
            user_id: task.user_id,
            title: task.title,
            is_completed: task.is_completed,
            created_at: this.toTimestamp(task.created_at),
            updated_at: this.toTimestamp(task.updated_at),
            scheduled_for: task.scheduled_for ? this.toTimestamp(task.scheduled_for) : undefined,
            last_moved_outcome_at: task.last_moved_outcome_at ? this.toTimestamp(task.last_moved_outcome_at) : undefined,
            completed_at: task.completed_at ? this.toTimestamp(task.completed_at) : undefined,
            outcome: task.outcome,
            driver: task.driver,
        };
    }

    static toTimestamp(date: Date): any {
        if (!date) return undefined;
        return {
            seconds: Math.floor(date.getTime() / 1000),
            nanos: (date.getTime() % 1000) * 1000000,
        };
    }

      static toDate(timestamp: any): Date {
    if (!timestamp) return new Date();
    if (typeof timestamp === 'string') return new Date(timestamp);
    if (timestamp.seconds !== undefined) return new Date(timestamp.seconds * 1000);
    return new Date();
  }
}