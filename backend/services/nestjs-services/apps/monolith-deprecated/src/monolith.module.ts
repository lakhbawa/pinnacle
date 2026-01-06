import {Module} from '@nestjs/common';
import {MonolithController} from './monolith.controller';
import {MonolithService} from './monolith.service';
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
      envFilePath: 'apps/monolith/.env',
        load: [appConfig],
    }),ProjectsModule, ListsModule, IssuesModule, UsersModule, AuthModule],
    controllers: [MonolithController],
    providers: [MonolithService],

})
export class MonolithModule {
}
