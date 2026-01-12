import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { AccountsSeeder } from './accounts.seeder';
import {PrismaModule} from "../../prisma.module";
import {AuthenticationModule} from "../../authentication/authentication.module";
import {ConfigModule} from "@nestjs/config";
import {join} from "path";
import appConfig from "@app/common/config/app.config";

@Module({
  imports: [PrismaModule, AuthenticationModule, ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps/auth-service/.env'),
      load: [appConfig],
    }),],
  providers: [
    SeederService,
    AccountsSeeder,
  ],
  exports: [SeederService],
})
export class SeederModule {}