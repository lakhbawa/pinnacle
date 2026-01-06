import {Injectable} from '@nestjs/common';

@Injectable()
export class MonolithService {
    getHello(): string {
        return 'Hello World!';
    }
}
