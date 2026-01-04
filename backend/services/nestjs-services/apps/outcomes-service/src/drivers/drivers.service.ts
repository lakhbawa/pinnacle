import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma.service";
import { Prisma, Driver } from '../generated/prisma-client';

@Injectable()
export class DriversService {
    constructor(private prisma: PrismaService) {}

    async create(data: Prisma.DriverCreateInput): Promise<Driver> {
        return this.prisma.driver.create({ data });
    }

    async count(params: { where?: Prisma.DriverWhereInput }): Promise<number> {
        return this.prisma.driver.count(params);
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.DriverWhereUniqueInput;
        where?: Prisma.DriverWhereInput;
        orderBy?: Prisma.DriverOrderByWithRelationInput;
        include?: Prisma.DriverInclude;
    }): Promise<Driver[]> {
        const { skip, take, cursor, where, orderBy, include } = params;
        return this.prisma.driver.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include,
        });
    }

    async findOne(
        where: Prisma.DriverWhereUniqueInput,
        include?: Prisma.DriverInclude
    ): Promise<Driver | null> {
        return this.prisma.driver.findUnique({ where, include });
    }

    async update(params: {
        where: Prisma.DriverWhereUniqueInput;
        data: Prisma.DriverUpdateInput;
    }): Promise<Driver> {
        const { data, where } = params;
        return this.prisma.driver.update({ data, where });
    }

    async remove(where: Prisma.DriverWhereUniqueInput): Promise<Driver> {
        return this.prisma.driver.delete({ where });
    }
}