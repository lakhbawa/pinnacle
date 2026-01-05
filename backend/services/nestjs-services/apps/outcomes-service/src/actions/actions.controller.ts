import {Controller} from '@nestjs/common';
import {ActionsService} from './actions.service';
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

    getAction(request: GetActionRequest): Promise<Action> {
        throw new Error('Method not implemented.');
    }

    listActions(request: ListActionsRequest): Promise<ListActionsResponse> {
        throw new Error('Method not implemented.');
    }

    updateAction(request: UpdateActionRequest): Promise<Action> {
        throw new Error('Method not implemented.');
    }

    deleteAction(request: DeleteActionRequest): Promise<DeleteActionResponse> {
        throw new Error('Method not implemented.');
    }

}
