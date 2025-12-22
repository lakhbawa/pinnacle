import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {UpdateProjectDto} from './dto/update-project.dto';
import {PrismaService} from "../prisma.service";
import {Project, Prisma} from "@prisma/client";

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

    async findOne(ProjectWhereUniqueInput: Prisma.ProjectWhereUniqueInput): Promise<Project | null> {
        return this.prisma.project.findUnique({
            where: ProjectWhereUniqueInput
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
