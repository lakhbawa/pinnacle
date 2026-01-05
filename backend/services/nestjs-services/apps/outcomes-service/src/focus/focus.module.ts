import { Module } from '@nestjs/common';
import { FocusService } from './focus.service';
import { FocusController } from './focus.controller';
import {PrismaService} from "../prisma.service";
import {OutcomesService} from "../outcomes/outcomes.service";

@Module({
  imports: [],
  controllers: [FocusController],
  providers: [FocusService, PrismaService, OutcomesService],
})
export class FocusModule {}
