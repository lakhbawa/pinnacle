// outcomes.controller.ts
import { Controller } from '@nestjs/common';
import { OutcomesService } from './outcomes.service';
import { outcomes } from "@app/common";
import { Prisma } from '@prisma/client';
import { OutcomeMapper } from '../mappers/outcome.mapper';

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
            deadline: OutcomeMapper.toDate(request.deadline),
        });
        return OutcomeMapper.toProto(outcome);
    }

    async listOutcomes(request: outcomes.ListOutcomesRequest): Promise<outcomes.ListOutcomesResponse> {
        const where: Prisma.OutcomeWhereInput = { userId: request.userId };
        if (request.status) {
            where.status = OutcomeMapper.toPrismaStatus(request.status);
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
            outcomes: outcomesList.map(OutcomeMapper.toProto),
            nextPageToken: '',
            totalCount: outcomesList.length,
        };
    }

    async getOutcome(request: outcomes.GetOutcomeRequest): Promise<outcomes.Outcome> {
        const outcome = await this.outcomesService.findOne(
            { id: request.id },
            { drivers: { include: { tasks: true } }, tasks: true }
        );
        if (!outcome) throw new Error('Outcome not found');
        return OutcomeMapper.toProto(outcome);
    }

    async updateOutcome(request: outcomes.UpdateOutcomeRequest): Promise<outcomes.Outcome> {
        const data: Prisma.OutcomeUpdateInput = {};
        if (request.title) data.title = request.title;
        if (request.whyItMatters) data.whyItMatters = request.whyItMatters;
        if (request.successMetricValue !== undefined) data.successMetricValue = request.successMetricValue;
        if (request.successMetricUnit) data.successMetricUnit = request.successMetricUnit;
        if (request.deadline) data.deadline = OutcomeMapper.toDate(request.deadline);
        if (request.status) data.status = OutcomeMapper.toPrismaStatus(request.status);

        const outcome = await this.outcomesService.update({ where: { id: request.id }, data });
        return OutcomeMapper.toProto(outcome);
    }

    async deleteOutcome(request: outcomes.DeleteOutcomeRequest): Promise<outcomes.DeleteOutcomeResponse> {
        await this.outcomesService.remove({ id: request.id });
        return { success: true };
    }
}