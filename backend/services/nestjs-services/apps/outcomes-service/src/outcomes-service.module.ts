import { Module } from '@nestjs/common';
import { OutcomesModule } from './outcomes/outcomes.module';
import {ConfigModule} from "@nestjs/config";
import appConfig from "@app/common/config/app.config";

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,  // Makes ConfigModule available everywhere
      envFilePath: 'apps/outcomes-service/.env',
        load: [appConfig],
    }), OutcomesModule],
  controllers: [],
  providers: [],
})
export class OutcomesServiceModule {}
