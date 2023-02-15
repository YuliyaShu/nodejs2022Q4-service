import { HttpException, HttpStatus } from '@nestjs/common';

export const DTOValidation = (DTOParam: any, type: string[]) => {
  if (typeof DTOParam === 'object' && DTOParam === null) {
    return;
  }
  if (!type.includes(typeof DTOParam)) {
    throw new HttpException(
      'Bad request. body is invalid (incorrect type)',
      HttpStatus.BAD_REQUEST,
    );
  }
};
