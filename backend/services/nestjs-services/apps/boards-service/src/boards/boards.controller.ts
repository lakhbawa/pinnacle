import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BoardsService } from './boards.service';

import {
  boards
} from "@app/common";
import {Observable} from "rxjs";
import {Metadata} from "@grpc/grpc-js";

@Controller()
@boards.BoardsServiceControllerMethods()
export class BoardsController implements boards.BoardsServiceController{
  constructor(private readonly boardsService: BoardsService) {}

  createBoard(createBoardDto: boards.CreateBoardDto) {
    return this.boardsService.create(createBoardDto);
  }

  findAllBoards() {
    return this.boardsService.findAll();
  }

  findOneBoard(findOneBoardDto: boards.FindOneBoardDto) {
    return this.boardsService.findOne(findOneBoardDto.id);
  }

  updateBoard(updateBoardDto: boards.UpdateBoardDto) {
    return this.boardsService.update(updateBoardDto.id, updateBoardDto);
  }

  removeBoard(findOneBoardDto: boards.FindOneBoardDto) {
    return this.boardsService.remove(findOneBoardDto.id);
  }

  queryBoards(paginationDtoStream: Observable<boards.PaginationDto>, metadata?: Metadata): Observable<boards.Boards> {
      return this.boardsService.queryBoards(paginationDtoStream);
  }
}
