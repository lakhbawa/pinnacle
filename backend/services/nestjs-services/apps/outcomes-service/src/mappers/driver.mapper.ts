import {Driver, Task} from "@app/common/types/outcomes_service/v1/models";

export class DriverMapper {
    static toProtoDriver(driver: any): Driver {
        return {
            id: driver.id,
            title: driver.title,
            outcome_id: driver.outcome_id,
            position: driver.position,
            created_at: this.toTimestamp(driver.created_at),
            tasks: driver.tasks?.map((t) => this.toProtoTask(t)) || [],
            outcome: undefined,
        };
    }

    static toProtoTask(task: any): Task {
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
            outcome: undefined,
            driver: undefined,
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