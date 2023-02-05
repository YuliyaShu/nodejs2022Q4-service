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
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { trackSchema } from './entities/track.schema';
import { createTrackSchema } from './dto/create-track.schema';
import { updateTrackSchema } from './dto/update-track.schema';

@ApiTags('Tracks')
@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  @ApiOperation({
    summary: 'Get tracks list',
    description: 'Gets all library tracks list',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful operation',
    schema: {
      example: [trackSchema],
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is missing or invalid',
  })
  async findAll() {
    return await this.tracksService.findAll();
  }

  @Get(':trackId')
  @ApiOperation({
    summary: 'Get single track',
    description: 'Gets single track by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful operation',
    schema: {
      example: trackSchema,
    },
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
  async findOne(@Param('trackId') id: string) {
    return await this.tracksService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Add new track',
    description: 'Adds new track information',
  })
  @ApiBody({
    schema: {
      example: createTrackSchema,
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful operation',
    schema: {
      example: trackSchema,
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
  async create(@Body() createTrackDto: CreateTrackDto) {
    return await this.tracksService.create(createTrackDto);
  }

  @Put(':trackId')
  @ApiOperation({
    summary: 'Update track information',
    description: 'Update library track information by UUID',
  })
  @ApiBody({
    schema: {
      example: updateTrackSchema,
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The track has been updated',
    schema: {
      example: trackSchema,
    },
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
  async update(
    @Param('trackId') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    return await this.tracksService.update(id, updateTrackDto);
  }

  @Delete(':trackId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete track',
    description: 'Deletes track by ID.',
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
  async remove(@Param('trackId') id: string) {
    return await this.tracksService.remove(id);
  }
}
