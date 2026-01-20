import {Controller} from '@nestjs/common';
import {SuccessMetricsService} from './success-metrics.service';
import {
    CreateSuccessMetricRequest, DeleteSuccessMetricRequest, DeleteSuccessMetricResponse,
    SuccessMetricsServiceController,
    SuccessMetricsServiceControllerMethods,
    GetSuccessMetricRequest,
    ListSuccessMetricsRequest,
    ListSuccessMetricsResponse,
    UpdateSuccessMetricRequest
} from "@app/common/types/outcomes_service/v1/success_metrics";
import {SuccessMetric} from '@app/common/types/outcomes_service/v1/models';
import {formatZodErrors} from "@app/common/helpers/validation/utils";
import {RpcException} from "@nestjs/microservices";
import {Status} from "@grpc/grpc-js/build/src/constants";
import {createSuccessMetricSchema} from "../validators/outcomes-service.schema";
import {SuccessMetricMapper} from "../mappers/success-metric.mapper";
import {getPagination, getPaginationMeta} from "@app/common/helpers/pagination";
import {Prisma} from '../generated/prisma-client';

@Controller()
@SuccessMetricsServiceControllerMethods()
export class SuccessMetricsController implements SuccessMetricsServiceController {
    constructor(private readonly successMetricsService: SuccessMetricsService) {
    }

    async createSuccessMetric(request: CreateSuccessMetricRequest): Promise<SuccessMetric> {
        const result = createSuccessMetricSchema.safeParse(request);

        if (!result.success) {
            const errors = formatZodErrors(result.error);

            throw new RpcException({
                code: Status.INVALID_ARGUMENT,
                message: JSON.stringify(errors),
            });
        }

        const metric = await this.successMetricsService.create({
            metric_name: request.metric_name,
            target_value: request.target_value,
            current_value: request.current_value || 0,
            unit: request.unit,
            description: request.description,
            outcome: {
                connect: {
                    id: request.outcome_id
                }
            },
        });

        return SuccessMetricMapper.toProtoSuccessMetric(metric);
    }

    async getSuccessMetric(request: GetSuccessMetricRequest): Promise<SuccessMetric> {
        const metric = await this.successMetricsService.findOne(
            {id: request.id},
            { outcome: true}
        );
        if (!metric) {
            throw new RpcException({
                code: Status.NOT_FOUND,
                message: 'Success metric not found',
            });
        }
        return SuccessMetricMapper.toProtoSuccessMetric(metric);
    }

    async listSuccessMetrics(request: ListSuccessMetricsRequest): Promise<ListSuccessMetricsResponse> {
        const where: Prisma.SuccessMetricWhereInput = {};

        if (request.outcome_id) {
            where.outcome_id = request.outcome_id;
        }

        const {pageSize, currentPage, skip} = getPagination(request);

        const [totalCount, metrics] = await Promise.all([
            this.successMetricsService.count({where}),
            this.successMetricsService.findAll({
                where,
                skip,
                take: pageSize,
                orderBy: {created_at: 'desc'},
            }),
        ]);

        const meta = getPaginationMeta(totalCount, pageSize, currentPage);

        return {
            data: metrics.map((m) => SuccessMetricMapper.toProtoSuccessMetric(m)),
            ...meta,
        };
    }

    async updateSuccessMetric(request: UpdateSuccessMetricRequest): Promise<SuccessMetric> {
        const data: Prisma.SuccessMetricUpdateInput = {};
        if (request.metric_name !== undefined) data.metric_name = request.metric_name;
        if (request.target_value !== undefined) data.target_value = request.target_value;
        if (request.current_value !== undefined) data.current_value = request.current_value;
        if (request.unit !== undefined) data.unit = request.unit;
        if (request.description !== undefined) data.description = request.description;

        const metric = await this.successMetricsService.update({where: {id: request.id}, data});
        return SuccessMetricMapper.toProtoSuccessMetric(metric);
    }

    async deleteSuccessMetric(request: DeleteSuccessMetricRequest): Promise<DeleteSuccessMetricResponse> {
        await this.successMetricsService.remove({id: request.id});
        return {success: true};
    }

}
