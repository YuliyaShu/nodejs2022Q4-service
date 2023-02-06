import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Favorites } from './entities/favorite.entity';
import { favoritesResponseSchema } from './entities/FavoritesResponse.schema';
import { FavoritesService } from './favorites.service';

@ApiTags('Favorites')
@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all favorites',
    description: 'Gets all favorites albums, tracks and artists',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful operation',
    schema: {
      example: [favoritesResponseSchema],
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is missing or invalid',
  })
  async findAll() {
    return await this.favoritesService.findAll();
  }

  @Post('track/:trackId')
  @ApiOperation({
    summary: 'Add track to the favorites',
    description: 'Adds track to the favorites',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Added successfully',
    type: Favorites,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Bad request. trackId is invalid (not uuid) / Track is already favorite',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is missing or invalid',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Track with id does not exist',
  })
  async addTrackToFav(@Param('trackId') id: string) {
    return await this.favoritesService.addTrackToFav(id);
  }

  @Delete('track/:trackId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete track from favorites',
    description: 'Deletes track from favorites',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. trackId is invalid (not uuid)',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is missing or invalid',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Track was not found',
  })
  async removeTrackFromFav(@Param('trackId') id: string) {
    return await this.favoritesService.removeTrackFromFav(id);
  }

  @Post('album/:albumId')
  @ApiOperation({
    summary: 'Add album to the favorites',
    description: 'Adds album to the favorites',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Added successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Bad request. albumId is invalid (not uuid) / Album is already favorite',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is missing or invalid',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Album with id does not exist',
  })
  async addAlbumToFav(@Param('albumId') id: string) {
    return await this.favoritesService.addAlbumToFav(id);
  }

  @Delete('album/:albumId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete album from favorites',
    description: 'Deletes album from favorites',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. albumId is invalid (not uuid)',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is missing or invalid',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Album was not found',
  })
  async removeAlbumFromFav(@Param('albumId') id: string) {
    return await this.favoritesService.removeAlbumFromFav(id);
  }

  @Post('artist/:artistId')
  @ApiOperation({
    summary: 'Add artist to the favorites',
    description: 'Adds artist to the favorites',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Added successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Bad request. artistId is invalid (not uuid) / Artist is already favorite',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is missing or invalid',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Artist with id does not exist',
  })
  async addArtistToFav(@Param('artistId') id: string) {
    return await this.favoritesService.addArtistToFav(id);
  }

  @Delete('artist/:artistId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete artist from favorites',
    description: 'Deletes artist from favorites',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is missing or invalid',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'artist was not found',
  })
  async removeArtistFromFav(@Param('artistId') id: string) {
    return await this.favoritesService.removeArtistFromFav(id);
  }
}
