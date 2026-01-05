// accounts.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma.service";
import { Prisma, Account } from '../generated/prisma-client';

@Injectable()
export class AccountsService {
    constructor(private prisma: PrismaService) {}

    async create(data: Prisma.AccountCreateInput): Promise<Account> {
        return this.prisma.account.create({ data });
    }

    async count(params: { where?: Prisma.AccountWhereInput }): Promise<number> {
        return this.prisma.account.count(params);
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.AccountWhereUniqueInput;
        where?: Prisma.AccountWhereInput;
        orderBy?: Prisma.AccountOrderByWithRelationInput;
    }): Promise<Account[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.account.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async findOne(
        where: Prisma.AccountWhereUniqueInput,
    ): Promise<Account | null> {
        return this.prisma.account.findUnique({ where });
    }

    async update(params: {
        where: Prisma.AccountWhereUniqueInput;
        data: Prisma.AccountUpdateInput;
    }): Promise<Account> {
        const { data, where } = params;
        return this.prisma.account.update({ data, where });
    }

    async remove(where: Prisma.AccountWhereUniqueInput): Promise<Account> {
        return this.prisma.account.delete({ where });
    }
}