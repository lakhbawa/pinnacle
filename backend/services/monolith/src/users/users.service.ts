import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {PrismaService} from "../prisma.service";

@Injectable()
export class UsersService {

    constructor(private prisma: PrismaService) {
    }

    create(createUserDto: CreateUserDto) {
        try {
            return this.prisma.user.create({
                data: {
                    name: createUserDto.name,
                    company: createUserDto.company,
                    email: createUserDto.email,
                    password: createUserDto.password
                }
            })
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException(error);
        }
    }

    async findAll() {
        return await this.prisma.user.findMany();
    }

    async findOne(id: string) {
        try {
            return await this.prisma.user.findUnique({
                where: {
                    id: id
                }
            })
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        try {

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
            return await this.prisma.user.update({
                where: {
                    id: id,
                },
                data
            })
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException(error);
        }
    }

    async remove(id: string) {
        try {
            return await this.prisma.user.delete({
                where: {
                    id: id
                }
            })
        }
    }
}
