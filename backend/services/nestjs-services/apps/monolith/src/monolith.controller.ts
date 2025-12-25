import {Controller, Get} from '@nestjs/common';
import {MonolithService} from './monolith.service';

@Controller()
export class MonolithController {
    constructor(private readonly appService: MonolithService) {
    }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}
