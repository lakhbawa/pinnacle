import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller()
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @MessagePattern('createBoard')
  create(@Payload() createBoardDto: CreateBoardDto) {
    return this.boardsService.create(createBoardDto);
  }

  @MessagePattern('findAllBoards')
  findAll() {
    return this.boardsService.findAll();
  }

  @MessagePattern('findOneBoard')
  findOne(@Payload() id: number) {
    return this.boardsService.findOne(id);
  }

  @MessagePattern('updateBoard')
  update(@Payload() updateBoardDto: UpdateBoardDto) {
    return this.boardsService.update(updateBoardDto.id, updateBoardDto);
  }

  @MessagePattern('removeBoard')
  remove(@Payload() id: number) {
    return this.boardsService.remove(id);
  }
}
