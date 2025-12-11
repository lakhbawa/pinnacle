import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import {Board} from "./entities/board.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class BoardsService {

  constructor(@InjectRepository(Board) private readonly boardRepository: Repository<Board>) {
  }
  create(createBoardDto: CreateBoardDto) {

    const board = new Board();
    board.title = createBoardDto.title;

    return this.boardRepository.save(board);
  }

  findAll() {
    return `This action returns all boards`;
  }

  findOne(id: string) {
    return `This action returns a #${id} board`;
  }

  update(id: string, updateBoardDto: UpdateBoardDto) {
    return `This action updates a #${id} board`;
  }

  remove(id: string) {
    return `This action removes a #${id} board`;
  }
}
