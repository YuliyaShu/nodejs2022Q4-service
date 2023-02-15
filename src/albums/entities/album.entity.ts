import { ApiProperty } from '@nestjs/swagger';

export class Album {
  @ApiProperty()
  id: string; // uuid v4
  @ApiProperty()
  name: string;
  @ApiProperty()
  year: number;
  @ApiProperty()
  artistId: string | null; // refers to Artist
}
