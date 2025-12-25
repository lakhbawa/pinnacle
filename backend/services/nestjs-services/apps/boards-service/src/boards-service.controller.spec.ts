import { Test, TestingModule } from '@nestjs/testing';
import { BoardsServiceController } from './boards-service.controller';
import { BoardsServiceService } from './boards-service.service';

describe('BoardsServiceController', () => {
  let boardsServiceController: BoardsServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BoardsServiceController],
      providers: [BoardsServiceService],
    }).compile();

    boardsServiceController = app.get<BoardsServiceController>(BoardsServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(boardsServiceController.getHello()).toBe('Hello World!');
    });
  });
});
