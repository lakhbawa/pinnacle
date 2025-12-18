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
  }): Promise<Project[]> {
        const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.project.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
    }

    async findOne(id: string) {
        return await this.prisma.project.findFirst({
            where: {
                id: id,
            }
        })
    }

    async update(id: string, updateBoardDto: UpdateProjectDto) {
        return await this.prisma.project.update({
            where: {
                id: id,
            },
            data: {
                title: updateBoardDto.title,
            }
        })

    }

    async remove(id: string) {
        try {
            return await this.prisma.project.delete({
                where: {
                    id: id,
                }
            })
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Could not delete project with id ${id}`);
            }
            throw new BadRequestException("Cannot delete project with id " + id);
        }
    }
}
