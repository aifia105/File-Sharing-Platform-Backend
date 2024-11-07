import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/guard/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'user logged in successfully',
  })
  @ApiOperation({ summary: 'Endpoint for users login' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
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
    description: 'user registered successfully',
  })
  @ApiOperation({ summary: 'Endpoint for for users registration' })
  @UseGuards(LocalAuthGuard)
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(registerDto);
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
}
