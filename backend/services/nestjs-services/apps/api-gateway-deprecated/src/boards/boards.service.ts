import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {BOARDS_SERVICE_NAME, BoardsServiceClient, CreateBoardDto, PaginationDto, UpdateBoardDto} from "@app/common";
import {BOARDS_SERVICE} from "./constants";
import * as microservices from "@nestjs/microservices";
import {ReplaySubject} from "rxjs";

@Injectable()
export class BoardsService implements OnModuleInit {

  private boardsService: BoardsServiceClient;

  constructor(@Inject(BOARDS_SERVICE) private client: microservices.ClientGrpc) {}

  onModuleInit(): any {
    this.boardsService = this.client.getService<BoardsServiceClient>(BOARDS_SERVICE_NAME);
  }

  create(createBoardDto: CreateBoardDto) {
    return this.boardsService.createBoard(createBoardDto);
  }

  findAll() {
    return this.boardsService.findAllBoards({})
  }

  findOne(id: string) {
    return this.boardsService.findOneBoard({ id})
  }

  update(id: string, updateBoardDto: UpdateBoardDto) {
    return this.boardsService.updateBoard({...updateBoardDto });
  }

  remove(id: string) {
    return this.boardsService.removeBoard({ id})
  }



  emailBoardUsers() {
    const boards$ = new ReplaySubject<PaginationDto>();
    boards$.next({ page: 0, skip: 25})
    boards$.next({ page: 1, skip: 25})
    boards$.next({ page: 2, skip: 25})

    boards$.complete();

    let chunkNumber = 1

    this.boardsService.queryBoards(boards$).subscribe(boards => {
      console.log('Chunk', chunkNumber)
      chunkNumber +=1
    })
  }

}
