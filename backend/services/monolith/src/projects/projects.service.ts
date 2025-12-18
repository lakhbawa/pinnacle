import {BadRequestException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {CreateProjectDto} from './dto/create-project.dto';
import {UpdateProjectDto} from './dto/update-project.dto';
import {PrismaService} from "../prisma.service";

@Injectable()
export class ProjectsService {

    constructor(private prisma: PrismaService) {

    }

    async create(createProjectDto: CreateProjectDto) {
        const project = await this.prisma.project.create({
            data: {
                title: createProjectDto.title,
            }
        })
        return project;
    }

    async findAll() {
        return await this.prisma.project.findMany();
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
