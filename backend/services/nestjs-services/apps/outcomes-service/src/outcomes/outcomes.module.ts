import { Module } from '@nestjs/common';
import { OutcomesService } from './outcomes.service';
import { OutcomesController } from './outcomes.controller';
import {PrismaService} from "../prisma.service";

@Module({
  controllers: [OutcomesController],
  providers: [OutcomesService, PrismaService],
  exports: [OutcomesService],
})
export class OutcomesModule {}
