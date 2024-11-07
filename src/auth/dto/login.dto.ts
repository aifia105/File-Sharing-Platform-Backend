import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'test@gamil.com',
    description: 'User email',
    format: 'email',
    type: 'string',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty({
    example: 'kghniuubgf12',
    description: 'User password',
    format: 'password',
    type: 'string',
  })
  @IsAlphanumeric()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
