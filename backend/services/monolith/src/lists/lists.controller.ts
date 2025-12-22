import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {ListsService} from './lists.service';
import {CreateListDto} from './dto/create-list.dto';
import {UpdateListDto} from './dto/update-list.dto';
import {Prisma} from "@prisma/client";

@Controller('api/lists')
export class ListsController {
    constructor(private readonly listsService: ListsService) {
    }

    @Post()
    create(@Body() createListDto: CreateListDto) {
        const order = createListDto.order
        return this.listsService.create({
            title: createListDto.title,
            order: order,
            project: {
                connect: {id: createListDto.project_id}
            }
        });
    }

    @Get()
    findAll(@Query() query: { project_id: string }) {
        const where: Prisma.ListWhereInput = {};

        if (query.project_id) {
            where.projectId = query.project_id;
        }
        return this.listsService.findAll({
            where
        });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {

        return this.listsService.findOne({id});
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateListDto: UpdateListDto) {
        const data: any = {};
        if (updateListDto.order) {
            data.order = updateListDto.order;
        }
        if (updateListDto.title) {
            data.title = updateListDto.title;
        }

        return this.listsService.update({
            where: {
                id
            },
            data
        });
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.listsService.remove({id});
    }
}
