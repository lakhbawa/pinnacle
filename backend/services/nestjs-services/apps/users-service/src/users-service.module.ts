import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import {ConfigModule} from "@nestjs/config";
import appConfig from "@app/common/config/app.config";

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,  // Makes ConfigModule available everywhere
      envFilePath: 'apps/users-service/.env',
        load: [appConfig],
    }), UsersModule],
  controllers: [],
  providers: [],
})
export class UsersServiceModule {}
