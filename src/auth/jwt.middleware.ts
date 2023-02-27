import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7, authHeader.length);
      try {
        const verifiedUser = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET_KEY,
        });
        req.user = verifiedUser;
        next();
      } catch (err) {
        throw new HttpException(
          'Unauthorized. Check your login or password',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } else {
      throw new HttpException(
        'Unauthorized. Check your login or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
