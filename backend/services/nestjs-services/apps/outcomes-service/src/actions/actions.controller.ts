import {Controller} from '@nestjs/common';
import {ActionsService} from './actions.service';
import {Prisma} from '../generated/prisma-client';
import {
    ActionsServiceController,
    ActionsServiceControllerMethods,
    CreateActionRequest,
    DeleteActionRequest,
    DeleteActionResponse,
    GetActionRequest,
    ListActionsRequest,
    ListActionsResponse,
    UpdateActionRequest
} from "@app/common/types/outcomes_service/v1/actions";
import {Action} from '@app/common/types/outcomes_service/v1/models';
import {Observable} from 'rxjs';
import {formatZodErrors} from "@app/common/helpers/validation/utils";
import {RpcException} from "@nestjs/microservices";
import {Status} from "@grpc/grpc-js/build/src/constants";
import {createActionSchema} from "../validators/outcomes-service.schema";
import {ActionMapper} from "../mappers/action.mapper";
import {getPagination, getPaginationMeta} from "@app/common/helpers/pagination";

@Controller()
@ActionsServiceControllerMethods()
export class ActionsController implements ActionsServiceController {
    constructor(private readonly actionsService: ActionsService) {
    }

    async createAction(request: CreateActionRequest): Promise<Action> {
        console.log('Received request:', JSON.stringify(request, null, 2));
        const result = createActionSchema.safeParse(request);

        if (!result.success) {
            const errors = formatZodErrors(result.error);

            throw new RpcException({
                code: Status.INVALID_ARGUMENT,
                message: JSON.stringify(errors),
            });
        }

        const action = await this.actionsService.create({
            user_id: request.user_id,
            title: request.title,
            outcome: {
                connect: {
                    id: request.outcome_id
                }
            },
            driver: {
                connect: {
                    id: request.driver_id
                }
            }

        });

        return ActionMapper.toProtoAction(action);
    }

    async getAction(request: GetActionRequest): Promise<Action> {
         const action = await this.actionsService.findOne(
            {id: request.id},
            {driver: true, outcome: true}
        );
        if (!action) {
            throw new RpcException({
                code: Status.NOT_FOUND,
                message: 'Action not found',
            });
        }

        return ActionMapper.toProtoAction(action);
    }

    async listActions(request: ListActionsRequest): Promise<ListActionsResponse> {
        const where: Prisma.ActionWhereInput = {};

        const {pageSize, currentPage, skip} = getPagination(request);

        const [totalCount, actions] = await Promise.all([
            this.actionsService.count({where}),
            this.actionsService.findAll({
                where,
                skip,
                take: pageSize,
                include: {driver: true, outcome: true},
                orderBy: {created_at: 'desc'},
            }),
        ]);

        const meta = getPaginationMeta(totalCount, pageSize, currentPage);

        return {
            data: actions.map((o) => ActionMapper.toProtoAction(o)),
            ...meta,
        };
    }

    async updateAction(request: UpdateActionRequest): Promise<Action> {
                console.log('Received request:', JSON.stringify(request, null, 2));
        const data: Prisma.ActionUpdateInput = {};
        if (request.title) data.title = request.title;
         if (request.scheduled_for) data.scheduled_for = ActionMapper.toDate(request.scheduled_for);
         if (request.completed_at) data.completed_at = ActionMapper.toDate(request.completed_at);
         // if (request.driver_id) data.driver_id = request.driver_id;
         // if (request.outcome_id) data.outcome_id = request.outcome_id;

        const action = await this.actionsService.update({where: {id: request.id}, data});
        return ActionMapper.toProtoAction(action);
    }

    async deleteAction(request: DeleteActionRequest): Promise<DeleteActionResponse> {
         await this.actionsService.remove({id: request.id});
        return {success: true};
    }

}
