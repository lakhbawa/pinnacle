import { Module } from '@nestjs/common';
import { OutcomesModule } from './outcomes/outcomes.module';
import {ConfigModule} from "@nestjs/config";
import appConfig from "@app/common/config/app.config";
import {DriversModule} from "./drivers/drivers.module";
import {ActionsModule} from "./actions/actions.module";
import {FocusModule} from "./focus/focus.module";

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,  // Makes ConfigModule available everywhere
      envFilePath: 'apps/outcomes-service/.env',
        load: [appConfig],
    }), OutcomesModule, DriversModule, ActionsModule, FocusModule],
  controllers: [],
  providers: [],
})
export class OutcomesServiceModule {}
