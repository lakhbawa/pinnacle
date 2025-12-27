import { Injectable } from '@nestjs/common';

@Injectable()
export class OutcomesServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
