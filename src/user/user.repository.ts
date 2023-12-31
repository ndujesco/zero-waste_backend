import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(params: { data: Prisma.UserCreateInput }): Promise<User> {
    const { data } = params;
    return this.prismaService.user.create({ data });
  }

  async findOne(params: { where: Prisma.UserWhereUniqueInput }): Promise<User> {
    const { where } = params;
    return this.prismaService.user.findUnique({ where });
  }

  async editUserInfo(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prismaService.user.update({ where, data });
  }

  async findUsers(params: { where: Prisma.UserWhereInput }): Promise<User[]> {
    const { where } = params;
    return this.prismaService.user.findMany({
      where,
    });
  }

  async deleteUser(params: {
    where: Prisma.UserWhereUniqueInput;
  }): Promise<User> {
    const { where } = params;
    return this.prismaService.user.delete({ where });
  }
}
