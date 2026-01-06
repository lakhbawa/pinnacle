import { Module } from '@nestjs/common';
import { OutcomesModule } from './outcomes/outcomes.module';
import {ConfigModule} from "@nestjs/config";
import appConfig from "@app/common/config/app.config";
import {DriversModule} from "./drivers/drivers.module";
import {ActionsModule} from "./actions/actions.module";
import {FocusModule} from "./focus/focus.module";
// import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,  // Makes ConfigModule available everywhere
      envFilePath: 'apps/outcomes-service/.env',
        load: [appConfig],
    }),
    //   ClientsModule.register([
    //   {
    //     name: 'KAFKA_SERVICE',
    //     transport: Transport.KAFKA,
    //     options: {
    //       client: {
    //         clientId: 'outcomes-service', // change per service
    //         brokers: ['pinnacle-kafka:29092'],
    //       },
    //       consumer: {
    //         groupId: 'outcomes-consumer', // unique per service
    //       },
    //     },
    //   },
    // ]),

      OutcomesModule, DriversModule, ActionsModule, FocusModule],
  controllers: [],
  providers: [],
})
export class OutcomesServiceModule {}
