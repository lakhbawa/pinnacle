import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {IssuesService} from './issues.service';
import {CreateIssueDto} from './dto/create-issue.dto';
import {UpdateIssueDto} from './dto/update-issue.dto';
import {Prisma} from "@prisma/client";

@Controller('api/issues')
export class IssuesController {
    constructor(private readonly issuesService: IssuesService) {
    }

    @Post()
    create(@Body() createIssueDto: CreateIssueDto) {

        return this.issuesService.create({
            title: createIssueDto.title,
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
            where
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
}
