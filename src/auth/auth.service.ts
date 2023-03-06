import { HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { HttpException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: CreateUserDto) {
    const user = await this.usersService.findOneByLogin(dto.login);
    if (!(user && (await bcrypt.compare(dto.password, user.password)))) {
      throw new HttpException(
        'Unauthorized. Check your login or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const tokens = await this.generateTokens(user.id, user.login);
    return tokens;
  }

  async signup(dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    const tokens = await this.generateTokens(user.id, user.login);
    return { ...user, ...tokens };
  }

  async generateTokens(id: string, login: string) {
    const payload = { sub: id, login: login };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      }),
    };
  }

  async newToken(dto: { refreshToken: string }) {
    try {
      const body = await this.jwtService.verifyAsync(dto.refreshToken);

      if (!body) {
        throw new HttpException(
          'Unauthorized. Check your login or password',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const user = await this.usersService.findOne(body.id);

      return await this.generateTokens(user.id, user.login);
    } catch (error) {
      throw new HttpException(
        'Unauthorized. Check your login or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
