import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, isBoolean } from 'class-validator';

export class CreateArtistDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  @IsBoolean()
  grammy: boolean;
}
