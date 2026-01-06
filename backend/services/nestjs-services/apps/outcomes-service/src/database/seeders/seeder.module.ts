import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { OutcomesSeeder } from './outcomes.seeder';
import {ConfigModule} from "@nestjs/config";
import {join} from "path";
import {OutcomesModule} from "../../outcomes/outcomes.module";
import appConfig from "@app/common/config/app.config";
import {PrismaModule} from "../../prisma.module";

@Module({
  imports: [PrismaModule, OutcomesModule, ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps/outcomes-service/.env'),
      load: [appConfig],
    }),],
  providers: [
    SeederService,
    OutcomesSeeder,
  ],
  exports: [SeederService],
})
export class SeederModule {}