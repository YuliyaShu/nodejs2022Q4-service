import { ApiProperty } from '@nestjs/swagger';

export class Artist {
  @ApiProperty()
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}
