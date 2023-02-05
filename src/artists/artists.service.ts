import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistsService {
  constructor(private db: DbService) {}

  async findAll() {
    return await this.db.getAllArtists();
  }

  async findOne(id: string) {
    return await this.db.getArtistById(id);
  }

  async create(createArtistDto: CreateArtistDto) {
    return await this.db.addArtist(createArtistDto);
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    return await this.db.updateArtist(id, updateArtistDto);
  }

  async remove(id: string) {
    return await this.db.deleteArtist(id);
  }
}
