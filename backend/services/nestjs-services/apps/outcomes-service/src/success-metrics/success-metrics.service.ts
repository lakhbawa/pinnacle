import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma.service";
import { Prisma, SuccessMetric } from '../generated/prisma-client';

@Injectable()
export class SuccessMetricsService {
    constructor(private prisma: PrismaService) {}

    async create(data: Prisma.SuccessMetricCreateInput): Promise<SuccessMetric> {
        return this.prisma.successMetric.create({ data });
    }

    async count(params: { where?: Prisma.SuccessMetricWhereInput }): Promise<number> {
        return this.prisma.successMetric.count(params);
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.SuccessMetricWhereUniqueInput;
        where?: Prisma.SuccessMetricWhereInput;
        orderBy?: Prisma.SuccessMetricOrderByWithRelationInput;
        include?: Prisma.SuccessMetricInclude;
    }): Promise<SuccessMetric[]> {
        const { skip, take, cursor, where, orderBy, include } = params;
        return this.prisma.successMetric.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include,
        });
    }

    async findOne(
        where: Prisma.SuccessMetricWhereUniqueInput,
        include?: Prisma.SuccessMetricInclude
    ): Promise<SuccessMetric | null> {
        return this.prisma.successMetric.findUnique({ where, include });
    }

    async update(params: {
        where: Prisma.SuccessMetricWhereUniqueInput;
        data: Prisma.SuccessMetricUpdateInput;
    }): Promise<SuccessMetric> {
        const { data, where } = params;
        return this.prisma.successMetric.update({ data, where });
    }

    async remove(where: Prisma.SuccessMetricWhereUniqueInput): Promise<SuccessMetric> {
        return this.prisma.successMetric.delete({ where });
    }
}
