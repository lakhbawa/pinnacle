import { Controller, Get } from '@nestjs/common';
import { BoardsService } from './boards.service';

@Controller()
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  getHello(): string {
    return this.boardsService.getHello();
  }
}
