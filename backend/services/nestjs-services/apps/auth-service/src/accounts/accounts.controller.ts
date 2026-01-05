import {Controller} from '@nestjs/common';
import {Prisma} from '../generated/prisma-client';
import {AccountMapper} from '../mappers/account.mapper';
import {createAccountSchema} from '../validators/auth-service.schema';
import {RpcException} from '@nestjs/microservices';
import {Status} from '@grpc/grpc-js/build/src/constants';
import {
    CreateAccountRequest,
    DeleteAccountRequest, DeleteAccountResponse, GetAccountRequest, ListAccountsRequest, ListAccountsResponse,
    AccountsServiceController,
    AccountsServiceControllerMethods, UpdateAccountRequest
} from "@app/common/types/auth_service/v1/accounts";
import {AccountsService} from "./accounts.service";
import {Account} from "@app/common/types/auth_service/v1/models";
import {formatZodErrors} from "@app/common/helpers/validation/utils";
import {getPagination, getPaginationMeta} from "@app/common/helpers/pagination";

@Controller()
@AccountsServiceControllerMethods()
export class AccountsController implements AccountsServiceController {
    constructor(private readonly accountsService: AccountsService) {
    }

    async createAccount(request: CreateAccountRequest): Promise<Account> {
        console.log('Received request:', JSON.stringify(request, null, 2));
        const result = createAccountSchema.safeParse(request);

        if (!result.success) {
            const errors = formatZodErrors(result.error);

            throw new RpcException({
                code: Status.INVALID_ARGUMENT,
                message: JSON.stringify(errors),
            });
        }

        const account = await this.accountsService.create({
            email: request.email,
            password: request.password,
            user_id: request.user_id
        });

        return AccountMapper.toProtoAccount(account);
    }

    async listAccounts(
        request: ListAccountsRequest,
    ): Promise<ListAccountsResponse> {
        const where: Prisma.AccountWhereInput = {};

        const {pageSize, currentPage, skip} = getPagination(request);

        const [totalCount, accounts] = await Promise.all([
            this.accountsService.count({where}),
            this.accountsService.findAll({
                where,
                skip,
                take: pageSize,
                orderBy: {created_at: 'desc'},
            }),
        ]);

        const meta = getPaginationMeta(totalCount, pageSize, currentPage);

        return {
            data: accounts.map((o) => AccountMapper.toProtoAccount(o)),
            ...meta,
        };
    }

    async getAccount(request: GetAccountRequest): Promise<Account> {
        const user = await this.accountsService.findOne(
            {user_id: request.user_id},
        );
        if (!user) {
            throw new RpcException({
                code: Status.NOT_FOUND,
                message: 'Account not found',
            });
        }
        return AccountMapper.toProtoAccount(user);
    }

    async updateAccount(request: UpdateAccountRequest): Promise<Account> {
        const data: Prisma.AccountUpdateInput = {};
        if (request.email) data.email = request.email;
        if (request.password !== undefined) data.password = request.password;

        const outcome = await this.accountsService.update({where: {user_id: request.user_id}, data});
        return AccountMapper.toProtoAccount(outcome);
    }

    async deleteAccount(request: DeleteAccountRequest): Promise<DeleteAccountResponse> {
        await this.accountsService.remove({user_id: request.user_id});
        return {success: true};
    }
}