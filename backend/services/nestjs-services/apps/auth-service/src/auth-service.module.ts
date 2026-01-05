import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import {ConfigModule} from "@nestjs/config";
import appConfig from "@app/common/config/app.config";
import {AuthenticationModule} from "./authentication/authentication.module";

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,  // Makes ConfigModule available everywhere
      envFilePath: 'apps/auth-service/.env',
        load: [appConfig],
    }), AccountsModule, AuthenticationModule],
  controllers: [],
  providers: [],
})
export class AuthServiceModule {}
