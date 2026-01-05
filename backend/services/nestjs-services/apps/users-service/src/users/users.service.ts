// users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma.service";
import { Prisma, User } from '../generated/prisma-client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({ data });
    }

    async count(params: { where?: Prisma.UserWhereInput }): Promise<number> {
        return this.prisma.user.count(params);
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<User[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.user.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async findOne(
        where: Prisma.UserWhereUniqueInput,
    ): Promise<User | null> {
        return this.prisma.user.findUnique({ where });
    }

    async update(params: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
    }): Promise<User> {
        const { data, where } = params;
        return this.prisma.user.update({ data, where });
    }

    async remove(where: Prisma.UserWhereUniqueInput): Promise<User> {
        return this.prisma.user.delete({ where });
    }
}