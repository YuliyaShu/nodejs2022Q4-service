import { ApiProperty } from '@nestjs/swagger';

export class Artist {
  @ApiProperty()
  id: string; // uuid v4
  @ApiProperty()
  name: string;
  @ApiProperty()
  grammy: boolean;
}
