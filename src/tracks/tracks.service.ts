import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { v4 as uuidv4, validate } from 'uuid';
import { Track } from './entities/track.entity';
import { DTOValidation } from 'src/utils/DTOValidation';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class TracksService {
  constructor(
    private db: DbService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {}

  async findAll() {
    return this.db.tracks;
  }

  async findOne(id: string) {
    if (!validate(id)) {
      throw new HttpException(
        'Bad request. trackId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const track = this.db.tracks.find((track) => track.id === id);
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
    this.db.tracks.push(track);
    return track;
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
    this.db.tracks = this.db.tracks.filter(
      (trackForFilter) => trackForFilter.id !== id,
    );
    if (this.db.favs.tracks.includes(id)) {
      await this.favoritesService.removeTrackFromFav(id);
    }
  }
}
