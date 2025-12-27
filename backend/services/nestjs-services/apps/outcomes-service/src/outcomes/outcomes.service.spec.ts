import { Test, TestingModule } from '@nestjs/testing';
import { OutcomesService } from './outcomes.service';

describe('OutcomesService', () => {
  let service: OutcomesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OutcomesService],
    }).compile();

    service = module.get<OutcomesService>(OutcomesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
