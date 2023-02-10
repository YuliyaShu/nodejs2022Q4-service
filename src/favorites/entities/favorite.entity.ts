import { ApiProperty } from '@nestjs/swagger';

export class Favorites {
  @ApiProperty()
  artists: string[];
  @ApiProperty()
  albums: string[];
  @ApiProperty()
  tracks: string[];
}
