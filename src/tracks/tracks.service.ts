import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TracksService {
  constructor(private db: DbService) {}

  async findAll() {
    return await this.db.getAllTracks();
  }

  async findOne(id: string) {
    return this.db.getTrackById(id);
  }

  async create(createTrackDto: CreateTrackDto) {
    return await this.db.addTrack(createTrackDto);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    return await this.db.updateTrack(id, updateTrackDto);
  }

  async remove(id: string) {
    return await this.db.deleteTrack(id);
  }
}
