import { ApiProperty } from '@nestjs/swagger';

export class CreateTrackDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  artistId: string | null;
  @ApiProperty()
  albumId: string | null;
  @ApiProperty()
  duration: number;
}
