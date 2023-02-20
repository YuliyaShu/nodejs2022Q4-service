import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  id: string;
  @ApiProperty()
  login: string;
  @ApiProperty()
  version: number;
  @ApiProperty()
  createdAt: number;
  @ApiProperty()
  updatedAt: number;

  password: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
