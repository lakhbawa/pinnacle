import { Injectable } from '@nestjs/common';

@Injectable()
export class BoardsService {
  getHello(): string {
    return 'Hello World!';
  }
}
