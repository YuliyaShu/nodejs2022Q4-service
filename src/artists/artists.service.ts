import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { TracksService } from 'src/tracks/tracks.service';
import { DTOValidation } from 'src/utils/DTOValidation';
import { v4 as uuidv4, validate } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistsService {
  constructor(
    private db: DbService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {}

  async findAll() {
    return this.db.artists;
  }

  async findOne(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. artistId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const artist = this.db.artists.find((artist) => artist.id === id);
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
    this.db.artists.push(artist);
    return artist;
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
      artist.grammy = updateArtistDto.grammy;
    }
    if ('name' in updateArtistDto) {
      DTOValidation(updateArtistDto.name, ['string']);
      artist.name = updateArtistDto.name;
    }
    return artist;
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
    this.db.artists = this.db.artists.filter(
      (artistForFilter) => artistForFilter.id !== id,
    );
    const tracksWithArtistId = this.db.tracks.filter(
      (track) => track.artistId === id,
    );
    tracksWithArtistId.forEach((track) => {
      if (track) {
        track.artistId = null;
      }
    });
    const albumsWithArtistId = this.db.albums.filter(
      (album) => album.artistId === id,
    );
    albumsWithArtistId.forEach((album) => {
      if (album) {
        album.artistId = null;
      }
    });
    if (this.db.favs.artists.includes(id)) {
      await this.favoritesService.removeArtistFromFav(id);
    }
  }
}
