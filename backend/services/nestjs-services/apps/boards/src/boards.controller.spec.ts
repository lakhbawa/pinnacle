import { Test, TestingModule } from '@nestjs/testing';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

describe('BoardsController', () => {
  let boardsController: BoardsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BoardsController],
      providers: [BoardsService],
    }).compile();

    boardsController = app.get<BoardsController>(BoardsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(boardsController.getHello()).toBe('Hello World!');
    });
  });
});
