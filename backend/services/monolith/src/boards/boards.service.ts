import {Injectable} from '@nestjs/common';
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

    findAll() {
        return `This action returns all boards`;
    }

    findOne(id: number) {
        return `This action returns a #${id} board`;
    }

    update(id: number, updateBoardDto: UpdateBoardDto) {
        return `This action updates a #${id} board`;
    }

    remove(id: number) {
        return `This action removes a #${id} board`;
    }
}
