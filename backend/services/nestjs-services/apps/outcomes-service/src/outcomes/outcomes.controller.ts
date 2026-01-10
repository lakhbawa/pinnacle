import {Controller, Inject} from '@nestjs/common';
import {Prisma} from '../generated/prisma-client';
import {OutcomeMapper} from '../mappers/outcome.mapper';
import {createOutcomeSchema} from '../validators/outcomes-service.schema';
import {ClientKafka, RpcException} from '@nestjs/microservices';
import {Status} from '@grpc/grpc-js/build/src/constants';
import {
    CreateOutcomeRequest,
    DeleteOutcomeRequest, DeleteOutcomeResponse, GetOutcomeRequest, ListOutcomesRequest, ListOutcomesResponse,
    OutcomesServiceController,
    OutcomesServiceControllerMethods, UpdateOutcomeRequest
} from "@app/common/types/outcomes_service/v1/outcomes";
import {OutcomesService} from "./outcomes.service";
import {Outcome} from "@app/common/types/outcomes_service/v1/models";
import {formatZodErrors} from "@app/common/helpers/validation/utils";
import {getPagination, getPaginationMeta} from "@app/common/helpers/pagination";
import {KafkaService} from "@app/common/kafka/src/kafka.service";

@Controller()
@OutcomesServiceControllerMethods()
export class OutcomesController implements OutcomesServiceController {
    constructor(private readonly outcomesService: OutcomesService, private kafkaService: KafkaService,) {
    }

    async createOutcome(request: CreateOutcomeRequest): Promise<Outcome> {


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

    async listOutcomes(
        request: ListOutcomesRequest,
    ): Promise<ListOutcomesResponse> {

                await this.kafkaService.publish('outcomes-events', 'OUTCOME_CREATED', {
            recipient_ids: ['user-001'] ,
            data: {
                actor_id: ['user-001'],
                target_type: 'outcome',
                target_id: 'outcome-1',
                name: "Lakhveeer"
            }
        }
        );

        console.log('Received request:', JSON.stringify(request, null, 2));

        const where: Prisma.OutcomeWhereInput = {user_id: request.user_id};
        if (request.status) {
            where.status = OutcomeMapper.toPrismaStatus(request.status);
        }
        const {pageSize, currentPage, skip} = getPagination(request);

        const [totalCount, outcomes] = await Promise.all([
            this.outcomesService.count({where}),
            this.outcomesService.findAll({
                where,
                skip,
                take: pageSize,
                include: {
                    drivers: {include: {actions: true}},
                    actions: true,
                },
                orderBy: {created_at: 'desc'},
            }),
        ]);

        const meta = getPaginationMeta(totalCount, pageSize, currentPage);

        return {
            data: outcomes.map((o) => OutcomeMapper.toProto(o)),
            ...meta,
        };
    }

    async getOutcome(request: GetOutcomeRequest): Promise<Outcome> {
        const outcome = await this.outcomesService.findOne(
            {id: request.id},
            {drivers: {include: {actions: true}}, actions: true}
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

        const outcome = await this.outcomesService.update({where: {id: request.id}, data});
        return OutcomeMapper.toProto(outcome);
    }

    async deleteOutcome(request: DeleteOutcomeRequest): Promise<DeleteOutcomeResponse> {
        await this.outcomesService.remove({id: request.id});
        return {success: true};
    }
}