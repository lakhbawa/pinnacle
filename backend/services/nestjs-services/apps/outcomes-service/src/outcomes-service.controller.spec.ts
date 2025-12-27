import { Test, TestingModule } from '@nestjs/testing';
import { OutcomesServiceController } from './outcomes-service.controller';
import { OutcomesServiceService } from './outcomes-service.service';

describe('OutcomesServiceController', () => {
  let outcomesServiceController: OutcomesServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OutcomesServiceController],
      providers: [OutcomesServiceService],
    }).compile();

    outcomesServiceController = app.get<OutcomesServiceController>(OutcomesServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(outcomesServiceController.getHello()).toBe('Hello World!');
    });
  });
});
