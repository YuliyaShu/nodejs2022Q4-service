import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  id: string; // uuid v4
  @ApiProperty()
  login: string;
  @ApiProperty()
  version: number; // integer number, increments on update
  @ApiProperty()
  createdAt: number; // timestamp of creation
  @ApiProperty()
  updatedAt: number; // timestamp of last update

  password: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
