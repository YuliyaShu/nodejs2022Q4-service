import { ApiProperty } from '@nestjs/swagger';

export class Artist {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  grammy: boolean;
}
