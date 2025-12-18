import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import {PrismaService} from "../prisma.service";

@Module({
  controllers: [ListsController],
  providers: [ListsService, PrismaService],
})
export class ListsModule {}
