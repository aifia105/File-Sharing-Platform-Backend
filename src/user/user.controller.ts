import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { Public } from 'src/decorator/public.decorator';

@ApiTags('User endpoints')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCreatedResponse({
    type: UserDto,
    description: 'User created successfully',
  })
  @ApiOperation({ summary: 'Create user ' })
  @Post()
  async create(@Body() createUserDto: UserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: error.message,
        },
        HttpStatus.NOT_ACCEPTABLE,
        {
          cause: error,
        },
      );
    }
  }

  @ApiCreatedResponse({
    type: UserDto,
    description: 'Users fetched successfully',
  })
  @ApiOperation({ summary: 'Fetch all users' })
  @Get()
  async findAll() {
    try {
      return await this.userService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }

  @ApiCreatedResponse({
    type: UserDto,
    description: 'User fetched successfully',
  })
  @ApiOperation({ summary: 'Fetch user by id' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.userService.findOne(id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }

  @ApiCreatedResponse({
    type: UserDto,
    description: 'User fetched successfully',
  })
  @ApiOperation({ summary: 'Fetch user by email' })
  @Get(':email')
  async findOneByEmail(@Param('email') email: string) {
    try {
      return await this.userService.findOne(email);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }

  @ApiCreatedResponse({
    type: UserDto,
    description: 'User updated successfully',
  })
  @ApiOperation({ summary: 'Update user ' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UserDto) {
    try {
      return this.userService.update(id, updateUserDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: error.message,
        },
        HttpStatus.NOT_ACCEPTABLE,
        {
          cause: error,
        },
      );
    }
  }

  @ApiCreatedResponse({
    type: UserDto,
    description: 'User deleted successfully',
  })
  @ApiOperation({ summary: 'delete user ' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.userService.remove(id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }
}
