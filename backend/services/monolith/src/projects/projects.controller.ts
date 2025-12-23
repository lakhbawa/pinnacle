import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {ProjectsService} from './projects.service';
import {CreateProjectDto} from './dto/create-project.dto';
import {UpdateProjectDto} from './dto/update-project.dto';
import {buildInclude, normalizeQueryArray} from "../utils/prismaUtils";
@Controller('api/projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {
    }

    @Post()
    create(@Body() createProjectDto: CreateProjectDto) {
        console.log('Received DTO:', createProjectDto);
        console.log('DTO type:', typeof createProjectDto.title);
        console.log('DTO value:', createProjectDto.title);
        return this.projectsService.create({
            title: createProjectDto.title
        });
    }

    @Get()
    findAll(@Query() query: { include: any }) {
        console.log('Received DTO:', query);
        return this.projectsService.findAll({
            include: {
                lists: true
            }
        })
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Query() query: any) {
        const includes = normalizeQueryArray(query, 'include');
        const includeTree = includes.length ? buildInclude(includes) : undefined;
        return this.projectsService.findOne({id}, includeTree);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBoardDto: UpdateProjectDto) {
        return this.projectsService.update({
            where: {
                id: id
            },
            data: {
                title: updateBoardDto.title,
            }
        });
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        console.log('Deleting project');
        return this.projectsService.remove({
            id: id,
        });
    }
}
