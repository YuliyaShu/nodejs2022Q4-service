import { ApiProperty } from '@nestjs/swagger';

export class Favorites {
  @ApiProperty()
  artists: string[];
  albums: string[];
  tracks: string[];
}
