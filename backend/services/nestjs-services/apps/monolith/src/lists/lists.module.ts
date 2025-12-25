import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import {PrismaService} from "../prisma.service";
import {UsersService} from "../users/users.service";

@Module({
  controllers: [ListsController],
  providers: [ListsService, UsersService, PrismaService],
})
export class ListsModule {}
