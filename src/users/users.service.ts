import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserPrisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { getUserWithoutPassword } from 'src/utils/getUserWithoutPassword';
import { v4 as uuidv4, validate } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private async getUserByIdWithPassword(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. userId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.prisma.userPrisma.findUnique({ where: { id: id } });
    if (!user) {
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findAll() {
    const users = await this.prisma.userPrisma.findMany();
    if (!users.length) {
      return users;
    }
    const usersWithoutPassword = [...users].map((user) =>
      getUserWithoutPassword(user),
    );
    return usersWithoutPassword;
  }

  async findOne(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. userId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.prisma.userPrisma.findUnique({ where: { id: id } });
    if (!user) {
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }
    return getUserWithoutPassword(user);
  }

  async create(createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw new HttpException(
        'Bad request. body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user: UserPrisma = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.prisma.userPrisma.create({
      data: user,
    });
    return getUserWithoutPassword(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. userId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!updateUserDto.oldPassword || !updateUserDto.newPassword) {
      throw new HttpException(
        'Bad request. body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.getUserByIdWithPassword(id);
    if (!user) {
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }
    if (updateUserDto.oldPassword !== user.password) {
      throw new HttpException('oldPassword is wrong', HttpStatus.FORBIDDEN);
    }
    const updatedUser = await this.prisma.userPrisma.update({
      where: { id: id },
      data: updateUserDto,
    });
    return getUserWithoutPassword(updatedUser);
  }

  async remove(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. userId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.getUserByIdWithPassword(id);
    if (!user) {
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }
    await this.prisma.userPrisma.delete({ where: { id: id } });
  }
}
