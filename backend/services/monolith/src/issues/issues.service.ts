import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {Issue, Prisma} from "@prisma/client";

@Injectable()
export class IssuesService {

    constructor(private prisma: PrismaService) {
    }

    async create(data: Prisma.IssueCreateInput) {

        return await this.prisma.issue.create({
            data
        })

    }


    async findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.IssueWhereUniqueInput;
        where?: Prisma.IssueWhereInput;
        orderBy?: Prisma.IssueOrderByWithRelationInput;
        include?: Prisma.IssueInclude;
    }): Promise<Issue[]> {
        const {skip, take, cursor, where, orderBy, include} = params;
        return this.prisma.issue.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include,
        });
    }

    findOne(where: Prisma.IssueWhereUniqueInput) {
      return this.prisma.issue.findUnique({
          where
        });
    }

    async update(params: {
        where: Prisma.IssueWhereUniqueInput;
        data: Prisma.IssueUpdateInput;
    }) {
        const {data, where} = params;
        return await this.prisma.issue.update({
            data,
            where,
        })

    }


    async remove(where: Prisma.IssueWhereUniqueInput): Promise<Issue> {
        return this.prisma.issue.delete({
            where
        })

    }
}
