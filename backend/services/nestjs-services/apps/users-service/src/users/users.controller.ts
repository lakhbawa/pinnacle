import {Controller} from '@nestjs/common';
import {Prisma} from '../generated/prisma-client';
import {UserMapper} from '../mappers/user.mapper';
import {createUserSchema} from '../validators/users-service.schema';
import {RpcException} from '@nestjs/microservices';
import {Status} from '@grpc/grpc-js/build/src/constants';
import {
    CreateUserRequest,
    DeleteUserRequest, DeleteUserResponse, GetUserRequest, ListUsersRequest, ListUsersResponse,
    UsersServiceController,
    UsersServiceControllerMethods, UpdateUserRequest
} from "@app/common/types/users_service/v1/users";
import {UsersService} from "./users.service";
import {User} from "@app/common/types/users_service/v1/models";
import {formatZodErrors} from "@app/common/helpers/validation/utils";
import {getPagination, getPaginationMeta} from "@app/common/helpers/pagination";

@Controller()
@UsersServiceControllerMethods()
export class UsersController implements UsersServiceController {
    constructor(private readonly usersService: UsersService) {
    }

    async createUser(request: CreateUserRequest): Promise<User> {
        console.log('Received request:', JSON.stringify(request, null, 2));
        const result = createUserSchema.safeParse(request);

        if (!result.success) {
            const errors = formatZodErrors(result.error);

            throw new RpcException({
                code: Status.INVALID_ARGUMENT,
                message: JSON.stringify(errors),
            });
        }

        const user = await this.usersService.create({
            name: request.name,
            email: request.email,
            company: request.company,
        });

        return UserMapper.toProtoUser(user);
    }

    async listUsers(
        request: ListUsersRequest,
    ): Promise<ListUsersResponse> {
        const where: Prisma.UserWhereInput = {};

        const {pageSize, currentPage, skip} = getPagination(request);

        const [totalCount, users] = await Promise.all([
            this.usersService.count({where}),
            this.usersService.findAll({
                where,
                skip,
                take: pageSize,
                orderBy: {created_at: 'desc'},
            }),
        ]);

        const meta = getPaginationMeta(totalCount, pageSize, currentPage);

        return {
            data: users.map((o) => UserMapper.toProtoUser(o)),
            ...meta,
        };
    }

    async getUser(request: GetUserRequest): Promise<User> {
        const user = await this.usersService.findOne(
            {id: request.id},
        );
        if (!user) {
            throw new RpcException({
                code: Status.NOT_FOUND,
                message: 'User not found',
            });
        }
        return UserMapper.toProtoUser(user);
    }

    async updateUser(request: UpdateUserRequest): Promise<User> {
        const data: Prisma.UserUpdateInput = {};
        if (request.name) data.name = request.name;
        if (request.email) data.email = request.email;
        if (request.company !== undefined) data.company = request.company;

        const outcome = await this.usersService.update({where: {id: request.id}, data});
        return UserMapper.toProtoUser(outcome);
    }

    async deleteUser(request: DeleteUserRequest): Promise<DeleteUserResponse> {
        await this.usersService.remove({id: request.id});
        return {success: true};
    }
}