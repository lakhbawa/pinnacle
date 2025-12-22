import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';

@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create({
            name: createUserDto.name,
            company: createUserDto.company,
            email: createUserDto.email,
            password: createUserDto.password

        });
    }

    @Get()
    findAll() {
        return this.usersService.findAll({});
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne({id});
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const data: any = {}
        if (updateUserDto.password) {
            data.password = updateUserDto.password
        }
        if (updateUserDto.company) {
            data.company = updateUserDto.company
        }
        if (updateUserDto.email) {
            data.email = updateUserDto.email
        }
        if (updateUserDto.name) {
            data.name = updateUserDto.name
        }
        return this.usersService.update({
            where: {
                id
            },
            data
        });
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove({id});
    }
}
