import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/entities/user.entity';
import { getUserWithoutPassword } from 'src/utils/getUserWithoutPassword';
import { v4 as uuidv4, validate } from 'uuid';

@Injectable()
export class DbService {
  private users: User[] = [];

  async getAllUsers() {
    if (!this.users.length) {
      return this.users;
    }
    const usersWithoutPassword = [...this.users].map((user) =>
      getUserWithoutPassword(user),
    );
    return usersWithoutPassword;
  }

  async getUserById(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. userId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return getUserWithoutPassword(user);
  }

  private async getUserByIdWithPassword(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. userId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async addUser(createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw new HttpException(
        'Bad request. body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.users.push(user);
    return getUserWithoutPassword(user);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
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
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (updateUserDto.oldPassword !== user.password) {
      throw new HttpException('oldPassword is wrong', HttpStatus.FORBIDDEN);
    }
    user.password = updateUserDto.newPassword;
    user.version = user.version + 1;
    user.updatedAt = Date.now();
    return getUserWithoutPassword(user);
  }

  async deleteUser(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. userId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.getUserByIdWithPassword(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    this.users = this.users.filter((userForFilter) => userForFilter.id !== id);
    throw new HttpException('The user has been deleted', HttpStatus.NO_CONTENT);
  }
}
