import { Controller } from '@nestjs/common';
import { OutcomesService } from './outcomes.service';
import { outcomes } from '@app/common';
import { Prisma } from '../generated/prisma-client';
import { OutcomeMapper } from '../mappers/outcome.mapper';
import { createOutcomeSchema } from '../validators/outcome.schema';
import { RpcException } from '@nestjs/microservices';
import { Status } from '@grpc/grpc-js/build/src/constants';

@Controller()
@outcomes.OutcomeServiceControllerMethods()
export class OutcomesController implements outcomes.OutcomeServiceController {
  constructor(private readonly outcomesService: OutcomesService) {}

  async createOutcome(request: outcomes.CreateOutcomeRequest): Promise<outcomes.Outcome> {
    console.log('Received request:', JSON.stringify(request, null, 2));
    const result = createOutcomeSchema.safeParse(request);

    if (!result.success) {
      const errors = result.error.issues.reduce(
        (acc, issue) => {
          const field = issue.path.join('.');
          if (!acc[field]) {
            acc[field] = [];
          }
          acc[field].push(issue.message);
          return acc;
        },
        {} as Record<string, string[]>
      );

      throw new RpcException({
        code: Status.INVALID_ARGUMENT,
        message: JSON.stringify(errors),
      });
    }

    const outcome = await this.outcomesService.create({
      user_id: request.user_id,
      title: request.title,
      why_it_matters: request.why_it_matters,
      success_metric_value: request.success_metric_value,
      success_metric_unit: request.success_metric_unit,
      deadline: OutcomeMapper.toDate(request.deadline),
    });

    return OutcomeMapper.toProto(outcome);
  }

  async listOutcomes(request: outcomes.ListOutcomesRequest): Promise<outcomes.ListOutcomesResponse> {
    const where: Prisma.OutcomeWhereInput = { user_id: request.user_id };
    if (request.status) {
      where.status = OutcomeMapper.toPrismaStatus(request.status);
    }

    const page_size = request.page_size || 20;
    const current_page = request.page_token ? parseInt(request.page_token, 10) : 1;
    const skip = (current_page - 1) * page_size;

    const [total_count, outcomesList] = await Promise.all([
      this.outcomesService.count({ where }),
      this.outcomesService.findAll({
        where,
        skip,
        take: page_size,
        include: {
          drivers: { include: { tasks: true } },
          tasks: true,
        },
        orderBy: { created_at: 'desc' },
      }),
    ]);

    const total_pages = Math.ceil(total_count / page_size);
    const has_more = current_page < total_pages;

    return {
      data: outcomesList.map((o) => OutcomeMapper.toProto(o)),
      next_page_token: has_more ? String(current_page + 1) : '',
      total_count,
      page_size,
      current_page,
      total_pages,
    };
  }

  async getOutcome(request: outcomes.GetOutcomeRequest): Promise<outcomes.Outcome> {
    const outcome = await this.outcomesService.findOne(
      { id: request.id },
      { drivers: { include: { tasks: true } }, tasks: true }
    );
    if (!outcome) {
      throw new RpcException({
        code: Status.NOT_FOUND,
        message: 'Outcome not found',
      });
    }
    return OutcomeMapper.toProto(outcome);
  }

  async updateOutcome(request: outcomes.UpdateOutcomeRequest): Promise<outcomes.Outcome> {
    const data: Prisma.OutcomeUpdateInput = {};
    if (request.title) data.title = request.title;
    if (request.why_it_matters) data.why_it_matters = request.why_it_matters;
    if (request.success_metric_value !== undefined) data.success_metric_value = request.success_metric_value;
    if (request.success_metric_unit) data.success_metric_unit = request.success_metric_unit;
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