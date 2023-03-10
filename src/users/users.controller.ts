import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  Put,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { userSchema } from './entities/user.schema';
import { createUserSchema } from './dto/create-user.schema';
import { updateUserSchema } from './dto/update-user.schema';
import { User } from './entities/user.entity';
import { UserPrisma } from '@prisma/client';

@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users', description: 'Gets all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful operation',
    schema: {
      example: [userSchema],
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is missing or invalid',
  })
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':userId')
  @ApiOperation({
    summary: 'Get single user by id',
    description: 'Gets single user by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful operation',
    schema: {
      example: userSchema,
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. userId is invalid (not uuid)',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is missing or invalid',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User was not found',
  })
  async findOne(@Param('userId') id: string) {
    return await this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create user', description: 'Creates a new user' })
  @ApiBody({
    type: CreateUserDto,
    schema: {
      example: createUserSchema,
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been created',
    type: User,
    schema: {
      example: userSchema,
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
  async create(@Body() createUserDto: CreateUserDto): Promise<UserPrisma> {
    return await this.usersService.create(createUserDto);
  }

  @Put(':userId')
  @ApiOperation({
    summary: 'Update a user password',
    description: 'Updates a user password by ID',
  })
  @ApiBody({
    type: UpdateUserDto,
    schema: {
      example: updateUserSchema,
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been updated',
    schema: {
      example: userSchema,
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Bad request. userId is invalid (not uuid) / Bad request. body does not contain required fields',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is missing or invalid',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'oldPassword is wrong',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User was not found',
  })
  async update(
    @Param('userId') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete user',
    description: 'Deletes user by ID.',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The user has been deleted',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. userId is invalid (not uuid)',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access token is missing or invalid',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User was not found',
  })
  async remove(@Param('userId') id: string) {
    return await this.usersService.remove(id);
  }
}
