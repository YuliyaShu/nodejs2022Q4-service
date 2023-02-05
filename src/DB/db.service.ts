import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from 'src/albums/dto/create-album.dto';
import { UpdateAlbumDto } from 'src/albums/dto/update-album.dto';
import { Album } from 'src/albums/entities/album.entity';
import { CreateArtistDto } from 'src/artists/dto/create-artist.dto';
import { UpdateArtistDto } from 'src/artists/dto/update-artist.dto';
import { Artist } from 'src/artists/entities/artist.entity';
import { CreateTrackDto } from 'src/tracks/dto/create-track.dto';
import { UpdateTrackDto } from 'src/tracks/dto/update-track.dto';
import { Track } from 'src/tracks/entities/track.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/entities/user.entity';
import { DTOValidation } from 'src/utils/DTOValidation';
import { getUserWithoutPassword } from 'src/utils/getUserWithoutPassword';
import { v4 as uuidv4, validate } from 'uuid';

@Injectable()
export class DbService {
  private users: User[] = [];
  private artists: Artist[] = [];
  private tracks: Track[] = [];
  private albums: Album[] = [];

  private async getUserByIdWithPassword(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. userId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getAllUsers() {
    if (!this.users.length) {
      return this.users;
    }
    const usersWithoutPassword = [...this.users].map((user) =>
      getUserWithoutPassword(user),
    );
    return usersWithoutPassword;
  }

  async getUserById(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. userId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }
    return getUserWithoutPassword(user);
  }

  async addUser(createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw new HttpException(
        'Bad request. body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.users.push(user);
    return getUserWithoutPassword(user);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. userId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!updateUserDto.oldPassword || !updateUserDto.newPassword) {
      throw new HttpException(
        'Bad request. body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.getUserByIdWithPassword(id);
    if (!user) {
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }
    if (updateUserDto.oldPassword !== user.password) {
      throw new HttpException('oldPassword is wrong', HttpStatus.FORBIDDEN);
    }
    user.password = updateUserDto.newPassword;
    user.version = user.version + 1;
    user.updatedAt = Date.now();
    return getUserWithoutPassword(user);
  }

  async deleteUser(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. userId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.getUserByIdWithPassword(id);
    if (!user) {
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }
    this.users = this.users.filter((userForFilter) => userForFilter.id !== id);
  }

  async getAllArtists() {
    return this.artists;
  }

  async getArtistById(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. artistId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new HttpException('Artist was not found', HttpStatus.NOT_FOUND);
    }
    return artist;
  }

  async addArtist(createArtistDto: CreateArtistDto) {
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
    this.artists.push(artist);
    return artist;
  }

  async updateArtist(id: string, updateArtistDto: UpdateArtistDto) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. artistId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const artist = await this.getArtistById(id);
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

  async deleteArtist(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. artistId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const artist = await this.getArtistById(id);
    if (!artist) {
      throw new HttpException('Artist was not found', HttpStatus.NOT_FOUND);
    }
    this.artists = this.artists.filter(
      (artistForFilter) => artistForFilter.id !== id,
    );
    const tracksWithArtistId = this.tracks.filter(
      (track) => track.artistId === id,
    );
    tracksWithArtistId.forEach((track) => {
      if (track) {
        track.artistId = null;
      }
    });
    const albumsWithArtistId = this.albums.filter(
      (album) => album.artistId === id,
    );
    albumsWithArtistId.forEach((album) => {
      if (album) {
        album.artistId = null;
      }
    });
  }

  async getAllTracks() {
    return this.tracks;
  }

  async getTrackById(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. trackId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const track = this.tracks.find((track) => track.id === id);
    if (!track) {
      throw new HttpException('Track was not found', HttpStatus.NOT_FOUND);
    }
    return track;
  }

  async addTrack(createTrackDto: CreateTrackDto) {
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
    this.tracks.push(track);
    return track;
  }

  async updateTrack(id: string, updateTrackDto: UpdateTrackDto) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. trackId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const track = await this.getTrackById(id);
    if (!track) {
      throw new HttpException('Track was not found', HttpStatus.NOT_FOUND);
    }
    if ('albumId' in updateTrackDto) {
      DTOValidation(updateTrackDto.albumId, ['string', 'object']);
      track.albumId = updateTrackDto.albumId;
    }
    if ('artistId' in updateTrackDto) {
      DTOValidation(updateTrackDto.artistId, ['string', 'object']);
      track.artistId = updateTrackDto.artistId;
    }
    if ('duration' in updateTrackDto) {
      DTOValidation(updateTrackDto.duration, ['number']);
      track.duration = updateTrackDto.duration;
    }
    if ('name' in updateTrackDto) {
      DTOValidation(updateTrackDto.name, ['string']);
      track.name = updateTrackDto.name;
    }
    return track;
  }

  async deleteTrack(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. trackId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const track = await this.getTrackById(id);
    if (!track) {
      throw new HttpException('Track was not found', HttpStatus.NOT_FOUND);
    }
    this.tracks = this.tracks.filter(
      (trackForFilter) => trackForFilter.id !== id,
    );
  }

  async getAllAlbums() {
    return this.albums;
  }

  async getAlbumById(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. albumId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const album = this.albums.find((album) => album.id === id);
    if (!album) {
      throw new HttpException('Album was not found', HttpStatus.NOT_FOUND);
    }
    return album;
  }

  async addAlbum(createAlbumDto: CreateAlbumDto) {
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
    this.albums.push(album);
    return album;
  }

  async updateAlbum(id: string, updateAlbumDto: UpdateAlbumDto) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. albumId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const album = await this.getAlbumById(id);
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

  async deleteAlbum(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. albumId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const album = await this.getAlbumById(id);
    if (!album) {
      throw new HttpException('Album was not found', HttpStatus.NOT_FOUND);
    }
    this.albums = this.albums.filter(
      (albumForFilter) => albumForFilter.id !== id,
    );
    const tracksWithAlbumId = this.tracks.filter(
      (track) => track.albumId === id,
    );
    tracksWithAlbumId.forEach((track) => {
      if (track) {
        track.albumId = null;
      }
    });
  }
}
