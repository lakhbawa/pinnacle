import { Controller, Get } from '@nestjs/common';
import { BoardsServiceService } from './boards-service.service';

@Controller()
export class BoardsServiceController {
  constructor(private readonly boardsServiceService: BoardsServiceService) {}

  @Get()
  getHello(): string {
    return this.boardsServiceService.getHello();
  }
}
