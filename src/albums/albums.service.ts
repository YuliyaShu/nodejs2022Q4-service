import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(private db: DbService) {}

  async findAll() {
    return await this.db.getAllAlbums();
  }

  async findOne(id: string) {
    return await this.db.getAlbumById(id);
  }

  async create(createAlbumDto: CreateAlbumDto) {
    return await this.db.addAlbum(createAlbumDto);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    return await this.db.updateAlbum(id, updateAlbumDto);
  }

  async remove(id: string) {
    return await this.db.deleteAlbum(id);
  }
}
