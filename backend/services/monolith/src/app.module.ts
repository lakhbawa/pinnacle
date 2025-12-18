import {Module} from '@nestjs/common';
import {AppController} from './app.controller.js';
import {AppService} from './app.service.js';
import {ProjectsModule} from './projects/projects.module';
import { ConfigModule } from '@nestjs/config';
import { ListsModule } from './lists/lists.module';
import { IssuesModule } from './issues/issues.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import AppConfig from "./config/app.config";
import appConfig from "./config/app.config";
@Module({
    imports: [ConfigModule.forRoot({
      isGlobal: true,  // Makes ConfigModule available everywhere
      envFilePath: '.env',
        load: [appConfig],
    }),ProjectsModule, ListsModule, IssuesModule, UsersModule, AuthModule],
    controllers: [AppController],
    providers: [AppService],

})
export class AppModule {
}
