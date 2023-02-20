import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { v4 as uuidv4, validate } from 'uuid';
import { Album } from './entities/album.entity';
import { DTOValidation } from 'src/utils/DTOValidation';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.albumPrisma.findMany();
  }

  async findOne(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. albumId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const album = await this.prisma.albumPrisma.findUnique({
      where: { id: id },
    });
    if (!album) {
      throw new HttpException('Album was not found', HttpStatus.NOT_FOUND);
    }
    return album;
  }

  async create(createAlbumDto: CreateAlbumDto) {
    if (
      !('name' in createAlbumDto) ||
      !('year' in createAlbumDto) ||
      !('artistId' in createAlbumDto)
    ) {
      throw new HttpException(
        'Bad request. body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const album: Album = {
      id: uuidv4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId,
    };
    return await this.prisma.albumPrisma.create({
      data: album,
    });
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. albumId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const album = await this.findOne(id);
    if (!album) {
      throw new HttpException('Album was not found', HttpStatus.NOT_FOUND);
    }
    if ('name' in updateAlbumDto) {
      DTOValidation(updateAlbumDto.name, ['string']);
    }
    if ('artistId' in updateAlbumDto) {
      DTOValidation(updateAlbumDto.artistId, ['string', 'object']);
    }
    if ('year' in updateAlbumDto) {
      DTOValidation(updateAlbumDto.year, ['number']);
    }
    return await this.prisma.albumPrisma.update({
      where: { id: id },
      data: updateAlbumDto,
    });
  }

  async remove(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. albumId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const album = await this.findOne(id);
    if (!album) {
      throw new HttpException('Album was not found', HttpStatus.NOT_FOUND);
    }
    await this.prisma.albumPrisma.delete({ where: { id: id } });
  }
}
