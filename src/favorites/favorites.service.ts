import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { validate } from 'uuid';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const [favEntity] = await this.prisma.favoritesPrisma.findMany({
      select: {
        artists: {
          select: { id: true, name: true, grammy: true },
        },
        albums: {
          select: { id: true, name: true, year: true, artistId: true },
        },
        tracks: {
          select: {
            id: true,
            name: true,
            duration: true,
            artistId: true,
            albumId: true,
          },
        },
      },
    });
    if (!favEntity) {
      return {
        artists: [],
        albums: [],
        tracks: [],
      };
    }
    return favEntity;
  }

  async addTrackToFav(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. trackId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const track = await this.prisma.trackPrisma.findFirst({
      where: { id: id },
    });
    if (!track) {
      throw new HttpException(
        'Track with id does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const favorites = await this.prisma.favoritesPrisma.findMany();
    if (!favorites.length) {
      const newFavs = await this.prisma.favoritesPrisma.create({
        data: {},
      });
      await this.prisma.trackPrisma.update({
        where: { id: id },
        data: { favoritesId: newFavs.id },
      });
    } else {
      await this.prisma.trackPrisma.update({
        where: { id: id },
        data: { favoritesId: favorites[0].id },
      });
    }
    return track;
  }

  async removeTrackFromFav(id: string) {
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
      throw new HttpException(
        'Track with id does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    await this.prisma.trackPrisma.update({
      where: { id: id },
      data: { favoritesId: { set: null } },
    });
  }

  async addAlbumToFav(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. albumId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const album = await this.prisma.albumPrisma.findFirst({
      where: { id: id },
    });
    if (!album) {
      throw new HttpException(
        'Album with id does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const favorites = await this.prisma.favoritesPrisma.findMany();
    if (!favorites.length) {
      const newFavs = await this.prisma.favoritesPrisma.create({
        data: {},
      });
      await this.prisma.albumPrisma.update({
        where: { id: id },
        data: { favoritesId: newFavs.id },
      });
    } else {
      await this.prisma.albumPrisma.update({
        where: { id: id },
        data: { favoritesId: favorites[0].id },
      });
    }
    return album;
  }

  async removeAlbumFromFav(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. albumId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const album = await this.prisma.albumPrisma.findFirst({
      where: { id: id },
    });
    if (!album) {
      throw new HttpException(
        'Album with id does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    await this.prisma.albumPrisma.update({
      where: { id: id },
      data: { favoritesId: { set: null } },
    });
  }

  async addArtistToFav(id: string) {
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
      throw new HttpException(
        'Artist with id does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const favorites = await this.prisma.favoritesPrisma.findMany();
    if (!favorites.length) {
      const newFavs = await this.prisma.favoritesPrisma.create({
        data: {},
      });
      await this.prisma.artistPrisma.update({
        where: { id: id },
        data: { favoritesId: newFavs.id },
      });
    } else {
      await this.prisma.artistPrisma.update({
        where: { id: id },
        data: { favoritesId: favorites[0].id },
      });
    }
    return artist;
  }

  async removeArtistFromFav(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. artistId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const track = await this.prisma.artistPrisma.findUnique({
      where: { id: id },
    });
    if (!track) {
      throw new HttpException(
        'Track with id does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    await this.prisma.artistPrisma.update({
      where: { id: id },
      data: { favoritesId: { set: null } },
    });
  }
}
