import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { v4 as uuidv4, validate } from 'uuid';
import { Track } from './entities/track.entity';
import { DTOValidation } from 'src/utils/DTOValidation';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.trackPrisma.findMany();
  }

  async findOne(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. trackId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const track = await this.prisma.trackPrisma.findUnique({
      where: { id: id },
    });
    if (!track) {
      throw new HttpException('Track was not found', HttpStatus.NOT_FOUND);
    }
    return track;
  }

  async create(createTrackDto: CreateTrackDto) {
    if (
      !('albumId' in createTrackDto) ||
      !('artistId' in createTrackDto) ||
      !('duration' in createTrackDto) ||
      !('name' in createTrackDto)
    ) {
      throw new HttpException(
        'Bad request. body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const track: Track = {
      id: uuidv4(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId,
      albumId: createTrackDto.albumId,
      duration: createTrackDto.duration,
    };
    return await this.prisma.trackPrisma.create({
      data: track,
    });
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. trackId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const track = await this.findOne(id);
    if (!track) {
      throw new HttpException('Track was not found', HttpStatus.NOT_FOUND);
    }
    if ('albumId' in updateTrackDto) {
      DTOValidation(updateTrackDto.albumId, ['string', 'object']);
    }
    if ('artistId' in updateTrackDto) {
      DTOValidation(updateTrackDto.artistId, ['string', 'object']);
    }
    if ('duration' in updateTrackDto) {
      DTOValidation(updateTrackDto.duration, ['number']);
    }
    if ('name' in updateTrackDto) {
      DTOValidation(updateTrackDto.name, ['string']);
    }
    return await this.prisma.trackPrisma.update({
      where: { id: id },
      data: updateTrackDto,
    });
  }

  async remove(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. trackId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const track = await this.findOne(id);
    if (!track) {
      throw new HttpException('Track was not found', HttpStatus.NOT_FOUND);
    }
    await this.prisma.trackPrisma.delete({ where: { id: id } });
  }
}
