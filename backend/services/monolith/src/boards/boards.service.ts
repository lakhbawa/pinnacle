import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateBoardDto} from './dto/create-board.dto';
import {UpdateBoardDto} from './dto/update-board.dto';
import {PrismaService} from "../prisma.service";

@Injectable()
export class BoardsService {

    constructor(private prisma: PrismaService) {

    }
    async create(createBoardDto: CreateBoardDto) {
        const board = await this.prisma.board.create({
            data: {
                title: createBoardDto.title,
            }
        })
        return board;
    }

    async findAll() {
        return await this.prisma.board.findMany();
    }

    async findOne(id: string) {
        return await this.prisma.board.findFirst({
            where: {
                id: id,
            }
        })
    }

    async update(id: string, updateBoardDto: UpdateBoardDto) {
        return await this.prisma.board.update({
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
            return await this.prisma.board.delete({
            where: {
                id: id,
            }
        })
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Could not delete board with id ${id}`);
            }
            throw error;
        }

    }
}
