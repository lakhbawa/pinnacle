import {Module} from '@nestjs/common';
import {AppController} from './app.controller.js';
import {AppService} from './app.service.js';
import {BoardsModule} from './boards/boards.module.js';
import { ConfigModule } from '@nestjs/config';
@Module({
    imports: [ConfigModule.forRoot({
      isGlobal: true,  // Makes ConfigModule available everywhere
      envFilePath: '.env',
    }),BoardsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
