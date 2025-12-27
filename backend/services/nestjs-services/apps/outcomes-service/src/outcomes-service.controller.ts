import { Controller, Get } from '@nestjs/common';
import { OutcomesServiceService } from './outcomes-service.service';

@Controller()
export class OutcomesServiceController {
  constructor(private readonly outcomesServiceService: OutcomesServiceService) {}

  @Get()
  getHello(): string {
    return this.outcomesServiceService.getHello();
  }
}
