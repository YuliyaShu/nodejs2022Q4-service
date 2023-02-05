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
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { createArtistSchema } from './dto/create-artist.schema';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { updateArtistSchema } from './dto/update-artist.schema';
import { artistSchema } from './entities/artist.schema';

@ApiTags('Artists')
@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all artists', description: 'Gets all artists' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful operation',
    schema: {
      example: [artistSchema],
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is missing or invalid',
  })
  async findAll() {
    return await this.artistsService.findAll();
  }

  @Get(':artistId')
  @ApiOperation({
    summary: 'Get single artist by id',
    description: 'Gets single artist by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful operation',
    schema: {
      example: artistSchema,
    },
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
    description: 'Artist was not found',
  })
  async findOne(@Param('artistId') id: string) {
    return await this.artistsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Add new artist', description: 'Adds new artist' })
  @ApiBody({
    schema: {
      example: createArtistSchema,
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful operation',
    schema: {
      example: artistSchema,
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
  async create(@Body() createArtistDto: CreateArtistDto) {
    return await this.artistsService.create(createArtistDto);
  }

  @Put(':artistId')
  @ApiOperation({
    summary: 'Update artist information',
    description: 'Updates artist information by UUID',
  })
  @ApiBody({
    schema: {
      example: updateArtistSchema,
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The artist has been updated',
    schema: {
      example: artistSchema,
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Bad request. artistId is invalid (not uuid) / Bad request. body is invalid (incorrect type)',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is missing or invalid',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Artist was not found',
  })
  async update(
    @Param('artistId') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    return await this.artistsService.update(id, updateArtistDto);
  }

  @Delete(':artistId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete artist',
    description: 'Deletes artist from library',
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
    description: 'Artist was not found',
  })
  async remove(@Param('artistId') id: string) {
    return await this.artistsService.remove(id);
  }
}
