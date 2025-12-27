// outcomes.controller.ts
import { Controller } from '@nestjs/common';
import { OutcomesService } from './outcomes.service';
import { outcomes } from "@app/common";
import { Prisma, OutcomeStatus } from '@prisma/client';

@Controller()
@outcomes.OutcomeServiceControllerMethods()
export class OutcomesController implements outcomes.OutcomeServiceController {
    constructor(private readonly outcomesService: OutcomesService) {}

    async createOutcome(request: outcomes.CreateOutcomeRequest): Promise<outcomes.Outcome> {
        const outcome = await this.outcomesService.create({
            userId: request.userId,
            title: request.title,
            whyItMatters: request.whyItMatters,
            successMetricValue: request.successMetricValue,
            successMetricUnit: request.successMetricUnit,
            deadline: this.toDate(request.deadline),
        });

        return this.toProtoOutcome(outcome);
    }

    async listOutcomes(request: outcomes.ListOutcomesRequest): Promise<outcomes.ListOutcomesResponse> {
        const where: Prisma.OutcomeWhereInput = { userId: request.userId };

        if (request.status) {
        where.status = this.toPrismaStatus(request.status);
    }

        const outcomesList = await this.outcomesService.findAll({
            where,
            take: request.pageSize || 20,
            include: {
                drivers: { include: { tasks: true } },
                tasks: true,
            },
        });

        return {
            outcomes: outcomesList.map(o => this.toProtoOutcome(o)),
            nextPageToken: '',
            totalCount: outcomesList.length,
        };
    }

    async getOutcome(request: outcomes.GetOutcomeRequest): Promise<outcomes.Outcome> {
        const outcome = await this.outcomesService.findOne(
            { id: request.id },
            {
                drivers: { include: { tasks: true } },
                tasks: true,
            }
        );

        if (!outcome) {
            throw new Error('Outcome not found');
        }

        return this.toProtoOutcome(outcome);
    }

    async updateOutcome(request: outcomes.UpdateOutcomeRequest): Promise<outcomes.Outcome> {
        const data: Prisma.OutcomeUpdateInput = {};

        if (request.title) data.title = request.title;
        if (request.whyItMatters) data.whyItMatters = request.whyItMatters;
        if (request.successMetricValue !== undefined) {
            data.successMetricValue = request.successMetricValue;
        }
        if (request.successMetricUnit) data.successMetricUnit = request.successMetricUnit;
        if (request.deadline) data.deadline = this.toDate(request.deadline);
        if (request.status) data.status = this.toPrismaStatus(request.status);

        const outcome = await this.outcomesService.update({
            where: { id: request.id },
            data,
        });

        return this.toProtoOutcome(outcome);
    }

    async deleteOutcome(request: outcomes.DeleteOutcomeRequest): Promise<outcomes.DeleteOutcomeResponse> {
        await this.outcomesService.remove({ id: request.id });
        return { success: true };
    }

    // === Helper Methods ===

    private toProtoOutcome(outcome: any): outcomes.Outcome {
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

    private toProtoDriver(driver: any): outcomes.Driver {
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

    private toProtoTask(task: any): outcomes.Task {
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
            lastMovedOutcomeAt: task.lastMovedOutcomeAt
                ? this.toTimestamp(task.lastMovedOutcomeAt)
                : undefined,
            completedAt: task.completedAt ? this.toTimestamp(task.completedAt) : undefined,
            outcome: undefined,
            driver: undefined,
        };
    }

    private toTimestamp(date: Date): any {
        return {
            seconds: Math.floor(date.getTime() / 1000),
            nanos: (date.getTime() % 1000) * 1000000,
        };
    }

    private toDate(timestamp: any): Date {
    if (!timestamp) return new Date();
    if (timestamp.seconds === undefined) return new Date();
    return new Date(timestamp.seconds * 1000);
}

    private toProtoStatus(status: string): outcomes.OutcomeStatus {
        const statusMap = {
            'ACTIVE': outcomes.OutcomeStatus.OUTCOME_STATUS_ACTIVE,
            'PARKED': outcomes.OutcomeStatus.OUTCOME_STATUS_PARKED,
            'COMPLETED': outcomes.OutcomeStatus.OUTCOME_STATUS_COMPLETED,
            'ABANDONED': outcomes.OutcomeStatus.OUTCOME_STATUS_ABANDONED,
        };
        return statusMap[status] || outcomes.OutcomeStatus.OUTCOME_STATUS_ACTIVE;
    }

    private toPrismaStatus(status: outcomes.OutcomeStatus): OutcomeStatus {
    const statusMap: Record<number, OutcomeStatus> = {
        [outcomes.OutcomeStatus.OUTCOME_STATUS_ACTIVE]: OutcomeStatus.ACTIVE,
        [outcomes.OutcomeStatus.OUTCOME_STATUS_PARKED]: OutcomeStatus.PARKED,
        [outcomes.OutcomeStatus.OUTCOME_STATUS_COMPLETED]: OutcomeStatus.COMPLETED,
        [outcomes.OutcomeStatus.OUTCOME_STATUS_ABANDONED]: OutcomeStatus.ABANDONED,
    };
    return statusMap[status] || OutcomeStatus.ACTIVE;
}
}