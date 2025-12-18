import {Module} from '@nestjs/common';
import {AppController} from './app.controller.js';
import {AppService} from './app.service.js';
import {ProjectsModule} from './projects/projects.module';
import { ConfigModule } from '@nestjs/config';
import { ListsModule } from './lists/lists.module';
@Module({
    imports: [ConfigModule.forRoot({
      isGlobal: true,  // Makes ConfigModule available everywhere
      envFilePath: '.env',
    }),ProjectsModule, ListsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
