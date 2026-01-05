// actions.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma.service";
import { Prisma, Action } from '../generated/prisma-client';

@Injectable()
export class ActionsService {
    constructor(private prisma: PrismaService) {}

    async create(data: Prisma.ActionCreateInput): Promise<Action> {
        return this.prisma.action.create({ data });
    }

    async count(params: { where?: Prisma.ActionWhereInput }): Promise<number> {
        return this.prisma.action.count(params);
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.ActionWhereUniqueInput;
        where?: Prisma.ActionWhereInput;
        orderBy?: Prisma.ActionOrderByWithRelationInput;
        include?: Prisma.ActionInclude;
    }): Promise<Action[]> {
        const { skip, take, cursor, where, orderBy, include } = params;
        return this.prisma.action.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include,
        });
    }

    async findOne(
        where: Prisma.ActionWhereUniqueInput,
        include?: Prisma.ActionInclude
    ): Promise<Action | null> {
        return this.prisma.action.findUnique({ where, include });
    }

    async update(params: {
        where: Prisma.ActionWhereUniqueInput;
        data: Prisma.ActionUpdateInput;
    }): Promise<Action> {
        const { data, where } = params;
        return this.prisma.action.update({ data, where });
    }

    async remove(where: Prisma.ActionWhereUniqueInput): Promise<Action> {
        return this.prisma.action.delete({ where });
    }
}