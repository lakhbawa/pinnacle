import { Module } from '@nestjs/common';
import { OutcomesService } from './outcomes.service';
import { OutcomesController } from './outcomes.controller';
import {PrismaService} from "../prisma.service";
import { KafkaModule } from '@app/common/kafka/src/kafka.module';
import {ConfigModule} from "@nestjs/config";
import {OutcomesConsumer} from "../outcomes.consumer";

@Module({
  imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      KafkaModule,
  ],
  controllers: [OutcomesController],
  providers: [OutcomesService, PrismaService, OutcomesConsumer],
  exports: [OutcomesService],
})
export class OutcomesModule {}
