import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { AccountsSeeder } from './accounts.seeder';
import {PrismaModule} from "../../prisma.module";
import {AuthenticationModule} from "../../authentication/authentication.module";
import {ConfigModule} from "@nestjs/config";
import appConfig from "../../config/app.config";
import {join} from "path";

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