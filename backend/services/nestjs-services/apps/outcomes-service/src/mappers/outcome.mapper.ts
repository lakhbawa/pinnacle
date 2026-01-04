import {Driver, Outcome, Task, OutcomeStatus} from "@app/common/types/outcomes_service/v1/models";
import {OutcomeStatus as PrismaOutcomeStatus} from '../generated/prisma-client';
import {RpcException} from "@nestjs/microservices";
import {Status} from "@grpc/grpc-js/build/src/constants";

export class OutcomeMapper {
  static toProto(outcome: any): Outcome {
    return {
      id: outcome.id,
      user_id: outcome.user_id,
      title: outcome.title,
      why_it_matters: outcome.why_it_matters,
      success_metric_value: outcome.success_metric_value,
      success_metric_unit: outcome.success_metric_unit,
      deadline: this.toTimestamp(outcome.deadline),
      status: this.toProtoStatus(outcome.status),
      created_at: this.toTimestamp(outcome.created_at),
      completed_at: outcome.completed_at ? this.toTimestamp(outcome.completed_at) : undefined,
      archived_at: outcome.archived_at ? this.toTimestamp(outcome.archived_at) : undefined,
      drivers: outcome.drivers?.map((d) => this.toProtoDriver(d)) || [],
      tasks: outcome.tasks?.map((t) => this.toProtoTask(t)) || [],
    };
  }

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


  static toDate(timestamp: any): Date {
    if (!timestamp) return new Date();
    if (typeof timestamp === 'string') return new Date(timestamp);
    if (timestamp.seconds !== undefined) return new Date(timestamp.seconds * 1000);
    return new Date();
  }

  static toProtoStatus(status: string): OutcomeStatus {
    const map: Record<string, OutcomeStatus> = {
      ACTIVE: OutcomeStatus.ACTIVE,
      PARKED: OutcomeStatus.PARKED,
      COMPLETED: OutcomeStatus.COMPLETED,
      ABANDONED: OutcomeStatus.ABANDONED,
    };
    return map[status] || OutcomeStatus.ACTIVE;
  }

  static toPrismaStatus(status: OutcomeStatus): PrismaOutcomeStatus {
  if (status === OutcomeStatus.UNSPECIFIED) {
    throw new RpcException({
      code: Status.INVALID_ARGUMENT,
      message: 'Outcome status must be specified',
    });
  }

  return {
    [OutcomeStatus.ACTIVE]: PrismaOutcomeStatus.ACTIVE,
    [OutcomeStatus.PARKED]: PrismaOutcomeStatus.PARKED,
    [OutcomeStatus.COMPLETED]: PrismaOutcomeStatus.COMPLETED,
    [OutcomeStatus.ABANDONED]: PrismaOutcomeStatus.ABANDONED,
  }[status];
}
}