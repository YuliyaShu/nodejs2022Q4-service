import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class FavoritesService {
  constructor(private db: DbService) {}

  async findAll() {
    return await this.db.getAllFavs();
  }

  async addTrackToFav(id: string) {
    return await this.db.addTrackToFav(id);
  }

  async removeTrackFromFav(id: string) {
    return await this.db.removeTrackFromFav(id);
  }

  async addAlbumToFav(id: string) {
    return await this.db.addAlbumToFav(id);
  }

  async removeAlbumFromFav(id: string) {
    return await this.db.removeAlbumFromFav(id);
  }

  async addArtistToFav(id: string) {
    return await this.db.addArtistToFav(id);
  }

  async removeArtistFromFav(id: string) {
    return await this.db.removeArtistFromFav(id);
  }
}
