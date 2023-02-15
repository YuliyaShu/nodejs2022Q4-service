import { ApiProperty } from '@nestjs/swagger';

export class Album {
  @ApiProperty()
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}
