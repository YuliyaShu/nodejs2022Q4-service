import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { v4 as uuidv4, validate } from 'uuid';
import { Album } from './entities/album.entity';
import { DTOValidation } from 'src/utils/DTOValidation';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class AlbumsService {
  constructor(
    private db: DbService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {}

  async findAll() {
    return this.db.albums;
  }

  async findOne(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. albumId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const album = this.db.albums.find((album) => album.id === id);
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
    this.db.albums.push(album);
    return album;
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
      album.name = updateAlbumDto.name;
    }
    if ('artistId' in updateAlbumDto) {
      DTOValidation(updateAlbumDto.artistId, ['string', 'object']);
      album.artistId = updateAlbumDto.artistId;
    }
    if ('year' in updateAlbumDto) {
      DTOValidation(updateAlbumDto.year, ['number']);
      album.year = updateAlbumDto.year;
    }
    return album;
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
    this.db.albums = this.db.albums.filter(
      (albumForFilter) => albumForFilter.id !== id,
    );
    const tracksWithAlbumId = this.db.tracks.filter(
      (track) => track.albumId === id,
    );
    tracksWithAlbumId.forEach((track) => {
      if (track) {
        track.albumId = null;
      }
    });
    if (this.db.favs.albums.includes(id)) {
      await this.favoritesService.removeAlbumFromFav(id);
    }
  }
}
