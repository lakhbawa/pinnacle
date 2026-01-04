// outcome.mapper.ts
import {outcomes} from "@app/common";
import {OutcomeStatus} from '../generated/prisma-client';

export class OutcomeMapper {
    static toProto(outcome: any): outcomes.Outcome {
        return {
            id: outcome.id,
            userId: outcome.userId,
            title: outcome.title,
            whyItMatters: outcome.whyItMatters,
            successMetricValue: outcome.successMetricValue,
            successMetricUnit: outcome.successMetricUnit,
            deadline: this.toTimestamp(outcome.deadline),
            status: this.toProtoStatus(outcome.status),
            createdAt: this.toTimestamp(outcome.createdAt),
            completedAt: outcome.completedAt ? this.toTimestamp(outcome.completedAt) : undefined,
            archivedAt: outcome.archivedAt ? this.toTimestamp(outcome.archivedAt) : undefined,
            drivers: outcome.drivers?.map(d => this.toProtoDriver(d)) || [],
            tasks: outcome.tasks?.map(t => this.toProtoTask(t)) || [],
        };
    }

    static toProtoDriver(driver: any): outcomes.Driver {
        return {
            id: driver.id,
            title: driver.title,
            outcomeId: driver.outcomeId,
            position: driver.position,
            createdAt: this.toTimestamp(driver.createdAt),
            tasks: driver.tasks?.map(t => this.toProtoTask(t)) || [],
            outcome: undefined,
        };
    }

    static toProtoTask(task: any): outcomes.Task {
        return {
            id: task.id,
            driverId: task.driverId,
            outcomeId: task.outcomeId,
            userId: task.userId,
            title: task.title,
            isCompleted: task.isCompleted,
            createdAt: this.toTimestamp(task.createdAt),
            updatedAt: this.toTimestamp(task.updatedAt),
            scheduledFor: task.scheduledFor ? this.toTimestamp(task.scheduledFor) : undefined,
            lastMovedOutcomeAt: task.lastMovedOutcomeAt ? this.toTimestamp(task.lastMovedOutcomeAt) : undefined,
            completedAt: task.completedAt ? this.toTimestamp(task.completedAt) : undefined,
            outcome: undefined,
            driver: undefined,
        };
    }

    static toTimestamp(date: Date): any {
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

    static toProtoStatus(status: string): outcomes.OutcomeStatus {
        const map = {
            'ACTIVE': outcomes.OutcomeStatus.OUTCOME_STATUS_ACTIVE,
            'PARKED': outcomes.OutcomeStatus.OUTCOME_STATUS_PARKED,
            'COMPLETED': outcomes.OutcomeStatus.OUTCOME_STATUS_COMPLETED,
            'ABANDONED': outcomes.OutcomeStatus.OUTCOME_STATUS_ABANDONED,
        };
        return map[status] || outcomes.OutcomeStatus.OUTCOME_STATUS_ACTIVE;
    }

    static toPrismaStatus(status: outcomes.OutcomeStatus): OutcomeStatus {
        const map: Record<number, OutcomeStatus> = {
            [outcomes.OutcomeStatus.OUTCOME_STATUS_ACTIVE]: OutcomeStatus.ACTIVE,
            [outcomes.OutcomeStatus.OUTCOME_STATUS_PARKED]: OutcomeStatus.PARKED,
            [outcomes.OutcomeStatus.OUTCOME_STATUS_COMPLETED]: OutcomeStatus.COMPLETED,
            [outcomes.OutcomeStatus.OUTCOME_STATUS_ABANDONED]: OutcomeStatus.ABANDONED,
        };
        return map[status] || OutcomeStatus.ACTIVE;
    }
}