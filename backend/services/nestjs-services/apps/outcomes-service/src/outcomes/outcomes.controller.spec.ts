import { Test, TestingModule } from '@nestjs/testing';
import { OutcomesController } from './outcomes.controller';
import { OutcomesService } from './outcomes.service';

describe('OutcomesController', () => {
  let controller: OutcomesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OutcomesController],
      providers: [OutcomesService],
    }).compile();

    controller = module.get<OutcomesController>(OutcomesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
