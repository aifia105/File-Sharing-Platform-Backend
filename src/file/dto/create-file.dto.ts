import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFileDto {
  @ApiProperty({
    example: '12/06/2026',
    description: 'File expiration date',
    format: 'date',
  })
  @IsNotEmpty()
  @IsDate()
  expirationDate: Date;
  @ApiProperty({
    example: '264133434f834f8g4d84fd8d',
    description: 'user ID',
    format: 'string',
  })
  @IsNotEmpty()
  @IsString()
  user: string;
  @ApiProperty({
    example: 'public',
    description: 'File access control',
    format: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(['public', 'private'])
  accessControl: string;
  @ApiProperty({
    example: ['user1ID', 'user2ID'],
    description: 'File access list',
    format: 'array',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  accessList: string[];
}
