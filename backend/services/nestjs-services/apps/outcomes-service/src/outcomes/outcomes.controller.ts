import { Controller } from '@nestjs/common';
import {Prisma} from '../generated/prisma-client';
import { OutcomeMapper } from '../mappers/outcome.mapper';
import { createOutcomeSchema } from '../validators/outcomes-service.schema';
import { RpcException } from '@nestjs/microservices';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
    CreateOutcomeRequest,
    DeleteOutcomeRequest, DeleteOutcomeResponse, GetOutcomeRequest, ListOutcomesRequest, ListOutcomesResponse,
    OutcomesServiceController,
    OutcomesServiceControllerMethods, UpdateOutcomeRequest
} from "@app/common/types/outcomes_service/v1/outcomes";
import {OutcomesService} from "./outcomes.service";
import {Outcome} from "@app/common/types/outcomes_service/v1/models";
import {formatZodErrors} from "@app/common/helpers/validation/utils";

@Controller()
@OutcomesServiceControllerMethods()
export class OutcomesController implements OutcomesServiceController {
  constructor(private readonly outcomesService: OutcomesService) {}

  async createOutcome(request: CreateOutcomeRequest): Promise<Outcome> {
    console.log('Received request:', JSON.stringify(request, null, 2));
    const result = createOutcomeSchema.safeParse(request);

    if (!result.success) {
      const errors = formatZodErrors(result.error);

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

  async listOutcomes(request: ListOutcomesRequest): Promise<ListOutcomesResponse> {
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

  async getOutcome(request: GetOutcomeRequest): Promise<Outcome> {
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

  async updateOutcome(request: UpdateOutcomeRequest): Promise<Outcome> {
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

  async deleteOutcome(request: DeleteOutcomeRequest): Promise<DeleteOutcomeResponse> {
    await this.outcomesService.remove({ id: request.id });
    return { success: true };
  }
}