import {Module} from '@nestjs/common';
import {AppController} from './app.controller.js';
import {AppService} from './app.service.js';
import {BoardsModule} from './boards/boards.module.js';

@Module({
    imports: [BoardsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
