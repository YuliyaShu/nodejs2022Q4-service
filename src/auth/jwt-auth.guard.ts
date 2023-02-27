import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common/interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    try {
      const [bearer, token] = req.headers.authorization.split(' ');
      if (bearer !== 'Bearer' || !token) {
        throw new HttpException(
          'Unauthorized. Access token is missing or invalid',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const user = this.jwtService.verify(token);
      if (user) {
        return true;
      } else {
        throw new HttpException(
          'Unauthorized. Access token is missing or invalid',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error) {
      throw new HttpException(
        'Unauthorized. Access token is missing or invalid',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
