import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Files endpoints')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiCreatedResponse({
    description: 'File uploaded successfully',
  })
  @ApiOperation({ summary: 'Endpoint for upload files on Azure Blob storage' })
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10))
  async saveFile(
    @Body() createFileDto: CreateFileDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      return await this.fileService.saveFile(createFileDto, files);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  @ApiCreatedResponse({
    description: 'File download successfully',
  })
  @ApiOperation({
    summary: 'Endpoint for download files from Azure Blob storage',
  })
  @Get('download/:fileName')
  async downloadFile(@Param('fileName') fileName: string) {
    try {
      return await this.fileService.downloadFile(fileName);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }
}
