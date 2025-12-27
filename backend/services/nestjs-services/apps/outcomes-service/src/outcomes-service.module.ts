import { Module } from '@nestjs/common';
import { OutcomesServiceController } from './outcomes-service.controller';
import { OutcomesServiceService } from './outcomes-service.service';
import { OutcomesModule } from './outcomes/outcomes.module';
import {ConfigModule} from "@nestjs/config";
import appConfig from "@app/common/config/app.config";

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,  // Makes ConfigModule available everywhere
      envFilePath: 'apps/outcomes-service/.env',
        load: [appConfig],
    }), OutcomesModule],
  controllers: [OutcomesServiceController],
  providers: [OutcomesServiceService],
})
export class OutcomesServiceModule {}
