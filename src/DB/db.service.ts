import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from 'src/artists/dto/create-artist.dto';
import { UpdateArtistDto } from 'src/artists/dto/update-artist.dto';
import { Artist } from 'src/artists/entities/artist.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/entities/user.entity';
import { getUserWithoutPassword } from 'src/utils/getUserWithoutPassword';
import { v4 as uuidv4, validate } from 'uuid';

@Injectable()
export class DbService {
  private users: User[] = [];
  private artists: Artist[] = [];

  private async getUserByIdWithPassword(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. userId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

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
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }
    return getUserWithoutPassword(user);
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
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
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
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }
    this.users = this.users.filter((userForFilter) => userForFilter.id !== id);
  }

  async getAllArtists() {
    if (!this.artists.length) {
      return this.artists;
    }
    return this.artists;
  }

  async getArtistById(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. artistId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new HttpException('Artist was not found', HttpStatus.NOT_FOUND);
    }
    return artist;
  }

  async addArtist(createArtistDto: CreateArtistDto) {
    if (!createArtistDto.grammy || !createArtistDto.name) {
      throw new HttpException(
        'Bad request. body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const artist: Artist = {
      id: uuidv4(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    this.artists.push(artist);
    return artist;
  }

  async updateArtist(id: string, updateArtistDto: UpdateArtistDto) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. artistId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const artist = await this.getArtistById(id);
    console.log('🚀 ~ 11updateArtist ~ artist', artist);
    if (!artist) {
      throw new HttpException('Artist was not found', HttpStatus.NOT_FOUND);
    }
    if (
      typeof updateArtistDto.name !== 'string' ||
      typeof updateArtistDto.grammy !== 'boolean'
    ) {
      throw new HttpException(
        'Bad request. body is invalid (incorrect type)',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (updateArtistDto.grammy) {
      artist.grammy = updateArtistDto.grammy;
    }
    if (updateArtistDto.name) {
      artist.name = updateArtistDto.name;
    }
    console.log('🚀 ~ 22updateArtist ~ artist', artist);
    return artist;
  }

  async deleteArtist(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. artistId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const artist = await this.getArtistById(id);
    if (!artist) {
      throw new HttpException('Artist was not found', HttpStatus.NOT_FOUND);
    }
    this.artists = this.artists.filter(
      (artistForFilter) => artistForFilter.id !== id,
    );
  }
}
