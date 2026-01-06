import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {Prisma, Project} from '../generated/prisma-client';

@Injectable()
export class ProjectsService {

    constructor(private prisma: PrismaService) {

    }

    async create(data: Prisma.ProjectCreateInput) {
        return await this.prisma.project.create({
            data,
        });
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.ProjectWhereUniqueInput;
        where?: Prisma.ProjectWhereInput;
        orderBy?: Prisma.ProjectOrderByWithRelationInput;
        include?: Prisma.ProjectInclude;
    }): Promise<Project[]> {
        const {skip, take, cursor, where, orderBy, include} = params;
        return this.prisma.project.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include,
        });
    }

    async findOne(where: Prisma.ProjectWhereUniqueInput, include?: Prisma.ProjectInclude): Promise<Project | null> {
        return this.prisma.project.findUnique({
            where,
            include,
        })
    }

    async update(params: {
        where: Prisma.ProjectWhereUniqueInput;
        data: Prisma.ProjectUpdateInput;
    }) {
        const {data, where} = params;
        return await this.prisma.project.update({
            data,
            where,
        })

    }

    async remove(where: Prisma.ProjectWhereUniqueInput): Promise<Project> {
        return this.prisma.project.delete({
            where
        })

    }
}
