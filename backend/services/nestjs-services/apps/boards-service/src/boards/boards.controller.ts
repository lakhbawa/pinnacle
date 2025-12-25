import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BoardsService } from './boards.service';

import {
  Boards,
  BoardsServiceController,
  BoardsServiceControllerMethods,
  CreateBoardDto,
  FindOneBoardDto, PaginationDto,
  UpdateBoardDto
} from "@app/common";
import {Observable} from "rxjs";
import {Metadata} from "@grpc/grpc-js";

@Controller()
@BoardsServiceControllerMethods()
export class BoardsController implements BoardsServiceController{
  constructor(private readonly boardsService: BoardsService) {}

  createBoard(createBoardDto: CreateBoardDto) {
    return this.boardsService.create(createBoardDto);
  }

  findAllBoards() {
    return this.boardsService.findAll();
  }

  findOneBoard(findOneBoardDto: FindOneBoardDto) {
    return this.boardsService.findOne(findOneBoardDto.id);
  }

  updateBoard(updateBoardDto: UpdateBoardDto) {
    return this.boardsService.update(updateBoardDto.id, updateBoardDto);
  }

  removeBoard(findOneBoardDto: FindOneBoardDto) {
    return this.boardsService.remove(findOneBoardDto.id);
  }

  queryBoards(paginationDtoStream: Observable<PaginationDto>, metadata?: Metadata): Observable<Boards> {
      return this.boardsService.queryBoards(paginationDtoStream);
  }
}
