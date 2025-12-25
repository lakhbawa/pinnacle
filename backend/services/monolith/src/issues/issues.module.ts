import { Module } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import {PrismaService} from "../prisma.service";
import {UsersService} from "../users/users.service";

@Module({
  controllers: [IssuesController],
  providers: [IssuesService, UsersService, PrismaService],
})
export class IssuesModule {}
