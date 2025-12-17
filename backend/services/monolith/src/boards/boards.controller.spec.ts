import {Test, TestingModule} from '@nestjs/testing';
import {BoardsController} from './boards.controller.js';
import {BoardsService} from './boards.service.js';

describe('BoardsController', () => {
    let controller: BoardsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BoardsController],
            providers: [BoardsService],
        }).compile();

        controller = module.get<BoardsController>(BoardsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
