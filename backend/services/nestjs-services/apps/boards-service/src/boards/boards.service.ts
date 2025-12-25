import {Injectable, NotFoundException, OnModuleInit} from '@nestjs/common';
import {Board, Boards, CreateBoardDto, PaginationDto, UpdateBoardDto} from "@app/common";
import { randomUUID } from "crypto";
import {Observable, Subject} from "rxjs";

@Injectable()
export class BoardsService implements OnModuleInit {

    private readonly boards: Board[] = [];
  onModuleInit(): any {
    for(let i = 0; i < 100; i++) {
      this.create({ title: randomUUID()})
    }
  }


  create(createBoardDto: CreateBoardDto): Board {
    const board: Board = {
      ...createBoardDto,
      id: randomUUID()
    }
    this.boards.push(board);
    return board;
  }

  findAll(): Boards {
    return { boards: this.boards };
  }

  findOne(id: string): Board {
    return <Board>this.boards.find((board) => board.id === id)
  }

  update(id: string, updateBoardDto: UpdateBoardDto) {
    const boardIndex = (this.boards.findIndex((board) => board.id === id))

    if (boardIndex > -1) {
      this.boards[boardIndex] = {
        ...this.boards[boardIndex],
        ...updateBoardDto,
      }
    return this.boards[boardIndex];

    }
    throw new NotFoundException(`Could not find board: ${id}`);


  }

  remove(id: string) {
    const boardIndex = (this.boards.findIndex((board) => board.id === id))

    if (boardIndex > -1) {
      return this.boards.splice(boardIndex, 1)[0];
    }
    throw new NotFoundException(`Could not find board: ${id}`);

  }

  queryBoards(paginationDtoStream: Observable<PaginationDto>): Observable<Boards> {
    const subject = new Subject<Boards>()
    const onNext = (paginationDtoStream: PaginationDto) => {
      const start = paginationDtoStream.page * paginationDtoStream.skip;
      subject.next({
        boards: this.boards.slice(start, start + paginationDtoStream.skip)
      })
    }
    const onComplete = () => subject.complete();
    paginationDtoStream.subscribe({
      next: onNext,
      complete: onComplete,
    })
    return subject.asObservable();
  }
}
