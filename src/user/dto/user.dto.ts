import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UserDto {
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
  @ApiProperty({
    example: 'Winston churchill',
    description: 'User name',
    format: 'string',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    example: 'https://www.google.com',
    description: 'User picture URL',
    format: 'string',
    type: 'string',
  })
  @IsString()
  @IsOptional()
  picture: string;
  @ApiProperty({
    example: '123456789',
    description: 'User phone number',
    format: 'string',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
  @ApiProperty({
    example: 4,
    description: 'User uploaded files number',
    format: 'number',
    type: 'number',
  })
  @IsNumber()
  @IsNotEmpty()
  filesNumber: number;
}
