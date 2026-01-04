// outcomes.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma.service";
import { Prisma, Outcome } from '../generated/prisma-client';

@Injectable()
export class OutcomesService {
    constructor(private prisma: PrismaService) {}

    async create(data: Prisma.OutcomeCreateInput): Promise<Outcome> {
        return this.prisma.outcome.create({ data });
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.OutcomeWhereUniqueInput;
        where?: Prisma.OutcomeWhereInput;
        orderBy?: Prisma.OutcomeOrderByWithRelationInput;
        include?: Prisma.OutcomeInclude;
    }): Promise<Outcome[]> {
        const { skip, take, cursor, where, orderBy, include } = params;
        return this.prisma.outcome.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include,
        });
    }

    async findOne(
        where: Prisma.OutcomeWhereUniqueInput,
        include?: Prisma.OutcomeInclude
    ): Promise<Outcome | null> {
        return this.prisma.outcome.findUnique({ where, include });
    }

    async update(params: {
        where: Prisma.OutcomeWhereUniqueInput;
        data: Prisma.OutcomeUpdateInput;
    }): Promise<Outcome> {
        const { data, where } = params;
        return this.prisma.outcome.update({ data, where });
    }

    async remove(where: Prisma.OutcomeWhereUniqueInput): Promise<Outcome> {
        return this.prisma.outcome.delete({ where });
    }
}