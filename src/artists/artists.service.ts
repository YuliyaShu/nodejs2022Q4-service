import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DTOValidation } from 'src/utils/DTOValidation';
import { v4 as uuidv4, validate } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.artistPrisma.findMany();
  }

  async findOne(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. artistId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const artist = await this.prisma.artistPrisma.findUnique({
      where: { id: id },
    });
    if (!artist) {
      throw new HttpException('Artist was not found', HttpStatus.NOT_FOUND);
    }
    return artist;
  }

  async create(createArtistDto: CreateArtistDto) {
    if (!('grammy' in createArtistDto) || !('name' in createArtistDto)) {
      throw new HttpException(
        'Bad request. body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const artist: Artist = {
      id: uuidv4(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    return await this.prisma.artistPrisma.create({
      data: artist,
    });
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. artistId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const artist = await this.findOne(id);
    if (!artist) {
      throw new HttpException('Artist was not found', HttpStatus.NOT_FOUND);
    }
    if ('grammy' in updateArtistDto) {
      DTOValidation(updateArtistDto.grammy, ['boolean']);
    }
    if ('name' in updateArtistDto) {
      DTOValidation(updateArtistDto.name, ['string']);
    }
    return await this.prisma.artistPrisma.update({
      where: { id: id },
      data: updateArtistDto,
    });
  }

  async remove(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. artistId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const artist = await this.findOne(id);
    if (!artist) {
      throw new HttpException('Artist was not found', HttpStatus.NOT_FOUND);
    }
    await this.prisma.artistPrisma.delete({ where: { id: id } });
  }
}
