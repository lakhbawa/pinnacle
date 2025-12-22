import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {PrismaService} from "../prisma.service";
import {Prisma, User} from "@prisma/client";

@Injectable()
export class UsersService {

    constructor(private prisma: PrismaService) {
    }

    create(data: Prisma.UserCreateInput) {

            return this.prisma.user.create({
                data
            })
    }


       async findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;

    }): Promise<User[]> {
        const {skip, take, cursor, where, orderBy} = params;
        return this.prisma.user.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {

            return await this.prisma.user.findUnique({
                where
            })
    }

    async update(params: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput
    }) {
       const {data, where} = params;
            return await this.prisma.user.update({
                where,
                data
            })

    }

    async remove(where: Prisma.UserWhereUniqueInput): Promise<User> {

            return  this.prisma.user.delete({
                where
            })

    }
}
