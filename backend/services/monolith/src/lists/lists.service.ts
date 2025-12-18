import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateListDto} from './dto/create-list.dto';
import {UpdateListDto} from './dto/update-list.dto';
import {PrismaService} from "../prisma.service";

@Injectable()
export class ListsService {

    constructor(private prisma: PrismaService) {

    }

    async create(createListDto: CreateListDto) {
        const lastOrder = createListDto.order ?? 0
        const list = await this.prisma.list.create({
            data: {
                title: createListDto.title,
                projectId: createListDto.project_id,
                order: lastOrder,
            }
        })
        return list;
    }

    async findAll() {
        return await this.prisma.list.findMany();
    }

    async findOne(id: string) {
        try {
            return await this.prisma.list.findFirst({
                where: {
                    id: id,
                }
            })
        } catch (error) {
            throw new NotFoundException(
                "List with id '" + id + "' not found",
            );
        }

    }

    async update(id: string, updateListDto: UpdateListDto) {
        try {
            const data: any = {};
            if (updateListDto.order) {
                data.order = updateListDto.order;
            }
            if (updateListDto.title) {
                data.title = updateListDto.title;
            }
            const lastOrder = updateListDto.order ?? 0
            return await this.prisma.list.update(
                {
                    where: {
                        id: id,
                    },
                    data
                }
            )
        } catch (error) {
            throw error;
        }
    }

    async remove(id: string) {

        const list = await this.prisma.list.findUnique({
            where: {
                id: id,
            }
        })
        if (!list) {
            throw new NotFoundException()
        }
        return await this.prisma.list.delete({
                where: {
                    id: id,
                }
            }
        )
    }
}
