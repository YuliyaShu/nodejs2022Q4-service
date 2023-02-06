import { ApiProperty } from '@nestjs/swagger';

export class Track {
  @ApiProperty()
  id: string; // uuid v4
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}
