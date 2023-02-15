import { forwardRef, Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { DbModule } from 'src/db/db.module';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { FavoritesService } from 'src/favorites/favorites.service';
import { TracksModule } from 'src/tracks/tracks.module';
import { TracksService } from 'src/tracks/tracks.service';
import { ArtistsModule } from 'src/artists/artists.module';
import { ArtistsService } from 'src/artists/artists.service';

@Module({
  imports: [
    DbModule,
    forwardRef(() => FavoritesModule),
    forwardRef(() => TracksModule),
    forwardRef(() => ArtistsModule),
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService, FavoritesService, TracksService, ArtistsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
