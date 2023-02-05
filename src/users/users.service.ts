import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private db: DbService) {}

  async findAll() {
    return await this.db.getAllUsers();
  }

  async findOne(id: string) {
    return await this.db.getUserById(id);
  }

  async create(createUserDto: CreateUserDto) {
    return await this.db.addUser(createUserDto);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.db.updateUser(id, updateUserDto);
  }

  async remove(id: string) {
    return await this.db.deleteUser(id);
  }
}
