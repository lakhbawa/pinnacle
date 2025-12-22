import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {List, Prisma} from "@prisma/client";

@Injectable()
export class ListsService {

    constructor(private prisma: PrismaService) {

    }

    async create(data: Prisma.ListCreateInput): Promise<List> {
        return this.prisma.list.create({data});
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.ListWhereUniqueInput;
        where?: Prisma.ListWhereInput;
        orderBy?: Prisma.ListOrderByWithRelationInput;
        include?: Prisma.ListInclude;
    }): Promise<List[]> {
        const {skip, take, cursor, where, orderBy, include} = params;
        return this.prisma.list.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include,
        });
    }

    async findOne(where: Prisma.ListWhereUniqueInput, include?: Prisma.ListInclude): Promise<List | null> {
        return await this.prisma.list.findUnique({
            where,
            include
        })
    }


    async update(params: {
        where: Prisma.ListWhereUniqueInput;
        data: Prisma.ListUpdateInput;
    }) {
        const {data, where} = params;
        return await this.prisma.list.update({
            data,
            where,
        })

    }

    async remove(where: Prisma.ListWhereUniqueInput): Promise<List> {

        return this.prisma.list.delete({
            where
        })
    }
}
