import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AlbumsService } from 'src/albums/albums.service';
import { Album } from 'src/albums/entities/album.entity';
import { ArtistsService } from 'src/artists/artists.service';
import { Artist } from 'src/artists/entities/artist.entity';
import { DbService } from 'src/db/db.service';
import { Track } from 'src/tracks/entities/track.entity';
import { TracksService } from 'src/tracks/tracks.service';
import { validate } from 'uuid';
import { Favorites } from './entities/favorite.entity';
import { FavoritesResponse } from './entities/favoritesResponse.entity';

@Injectable()
export class FavoritesService {
  constructor(
    private db: DbService,
    @Inject(forwardRef(() => TracksService))
    private trackService: TracksService,
    @Inject(forwardRef(() => AlbumsService))
    private albumService: AlbumsService,
    @Inject(forwardRef(() => ArtistsService))
    private artistService: ArtistsService,
  ) {}

  async findAll() {
    const favsWithEntities: Favorites | FavoritesResponse = { ...this.db.favs };
    const result: FavoritesResponse = {
      artists: [],
      albums: [],
      tracks: [],
    };
    favsWithEntities.albums.map(async (item: string | Album) =>
      result.albums.push(await this.albumService.findOne(item as string)),
    );
    favsWithEntities.artists.map(async (item: string | Artist) =>
      result.artists.push(await this.artistService.findOne(item as string)),
    );
    favsWithEntities.tracks.map(async (item: string | Track) =>
      result.tracks.push(await this.trackService.findOne(item as string)),
    );
    return result;
  }

  async addTrackToFav(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. trackId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const track = this.db.tracks.find((track) => track.id === id);
    if (!track) {
      throw new HttpException(
        'Track with id does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const trackInFav = this.db.favs.tracks.find((trackId) => trackId === id);
    if (trackInFav) {
      throw new HttpException('Track was not found', HttpStatus.NOT_FOUND);
    }
    this.db.favs.tracks.push(id);
  }

  async removeTrackFromFav(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. trackId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const trackId = this.db.favs.tracks.find((trackId) => trackId === id);
    if (!trackId) {
      throw new HttpException('Track was not favorite', HttpStatus.NOT_FOUND);
    }
    this.db.favs.tracks = this.db.favs.tracks.filter(
      (trackId) => trackId !== id,
    );
  }

  async addAlbumToFav(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. albumId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const album = this.db.albums.find((album) => album.id === id);
    if (!album) {
      throw new HttpException(
        'Album with id does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (this.db.favs.albums.includes(album.id)) {
      throw new HttpException(
        'Album is already favorite',
        HttpStatus.BAD_REQUEST,
      );
    }
    this.db.favs.albums.push(id);
  }

  async removeAlbumFromFav(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. albumId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const albumId = this.db.favs.albums.find((albumId) => albumId === id);
    if (!albumId) {
      throw new HttpException('Album was not favorite', HttpStatus.NOT_FOUND);
    }
    this.db.favs.albums = this.db.favs.albums.filter(
      (albumId) => albumId !== id,
    );
  }

  async addArtistToFav(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. artistId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const artist = this.db.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new HttpException(
        'Artist with id does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (this.db.favs.artists.includes(artist.id)) {
      throw new HttpException(
        'Artist is already favorite',
        HttpStatus.BAD_REQUEST,
      );
    }
    this.db.favs.artists.push(id);
  }

  async removeArtistFromFav(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. artistId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const artistId = this.db.favs.artists.find((artistId) => artistId === id);
    if (!artistId) {
      throw new HttpException('Artist was not favorite', HttpStatus.NOT_FOUND);
    }
    this.db.favs.artists = this.db.favs.artists.filter(
      (artistId) => artistId !== id,
    );
  }
}
