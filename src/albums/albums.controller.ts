import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { createAlbumSchema } from './dto/create-album.schema';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { updateAlbumSchema } from './dto/update-album.schema';
import { albumSchema } from './entities/album.schema';

@ApiTags('Albums')
@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get albums list',
    description: 'Gets all library albums list',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful operation',
    schema: {
      example: [albumSchema],
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is missing or invalid',
  })
  async findAll() {
    return await this.albumsService.findAll();
  }

  @Get(':albumId')
  @ApiOperation({
    summary: 'Get single album',
    description: 'Gets single album by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful operation',
    schema: {
      example: albumSchema,
    },
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
  async findOne(@Param('albumId') id: string) {
    return await this.albumsService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Add new album',
    description: 'Adds new album information',
  })
  @ApiBody({
    schema: {
      example: createAlbumSchema,
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Album is created',
    schema: {
      example: albumSchema,
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. body does not contain required fields',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is missing or invalid',
  })
  async create(@Body() createAlbumDto: CreateAlbumDto) {
    return await this.albumsService.create(createAlbumDto);
  }

  @Put(':albumId')
  @ApiOperation({
    summary: 'Update album information',
    description: 'Update library album information by UUID',
  })
  @ApiBody({
    schema: {
      example: updateAlbumSchema,
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The album has been updated',
    schema: {
      example: albumSchema,
    },
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
  async update(
    @Param('albumId') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return await this.albumsService.update(id, updateAlbumDto);
  }

  @Delete(':albumId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete album',
    description: 'Delete album from library',
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
  async remove(@Param('albumId') id: string) {
    return await this.albumsService.remove(id);
  }
}
