import { Injectable } from '@nestjs/common';

@Injectable()
export class BoardsServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
