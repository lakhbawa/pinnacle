import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {ProjectsService} from './projects.service';
import {CreateProjectDto} from './dto/create-project.dto';
import {UpdateProjectDto} from './dto/update-project.dto';

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
    findAll() {
        return this.projectsService.findAll({
            include: {
                lists: true
            }
        })
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectsService.findOne({
            id
        });
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
