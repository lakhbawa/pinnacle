import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {IssuesService} from './issues.service';
import {CreateIssueDto} from './dto/create-issue.dto';
import {UpdateIssueDto} from './dto/update-issue.dto';
import {Prisma} from '../generated/prisma-client';
import {LexicographicOrderGenerator} from "../utils/lexicographicOrder.util";
import {UsersService} from "../users/users.service";
import {ReorderIssueDto} from "./dto/recorder-issue.dto";

@Controller('api/issues')
export class IssuesController {
    constructor(private readonly issuesService: IssuesService, private readonly userService: UsersService) {
    }

    @Post()
    async create(@Body() createIssueDto: CreateIssueDto) {
        const users = await this.userService.findAll({})
        console.log(users);

        const userId = users[0].id

        const issues = await this.issuesService.findAll({})
        console.log(issues);
        const lastIssueId = issues[issues.length]?.id ?? undefined;

        const position = await this.issuesService.calculatePosition(userId, createIssueDto.listId, undefined, lastIssueId)

        return this.issuesService.create({
            title: createIssueDto.title,
            position: position,
            user: {
                connect: {
                    id: userId,
                }
            },
            list: {
                connect: {
                    id: createIssueDto.listId,
                }
            },
            dueDate: createIssueDto.dueDate
        });
    }

    @Get()
    findAll(@Query() query: { list_id: string }) {
        const where: Prisma.IssueWhereInput = {};

        if (query.list_id) {
            where.listId = query.list_id;
        }
        return this.issuesService.findAll({
            where,
            orderBy: {
                position: 'asc'
            }
        });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.issuesService.findOne({id});
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateIssueDto: UpdateIssueDto) {
        const data: any = {};
        if (updateIssueDto.title) {
            data.title = updateIssueDto.title;
        }
        if (updateIssueDto.listId) {
            data.listId = updateIssueDto.listId;
        }
        if (updateIssueDto.dueDate) {
            data.dueDate = updateIssueDto.dueDate;
        }
        return this.issuesService.update({
            where: {id: id},
            data
        });
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.issuesService.remove({id});
    }

    @Post(':id/reorder')
    async reorder(@Param('id') id: string, @Body() reOrderIssueDto: ReorderIssueDto) {
        const users = await this.userService.findAll({})
        console.log(reOrderIssueDto);

        const userId = users[0].id

        return this.issuesService.reorder(userId, id, reOrderIssueDto);
    }
}
