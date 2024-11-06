import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { File, FileDocument } from './entities/file.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UploadService } from './upload.service';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    private readonly uploadService: UploadService,
  ) {}

  async saveFile(
    createFileDto: CreateFileDto,
    files: Express.Multer.File[],
  ): Promise<File[]> {
    try {
      const uploadedFiles = await this.uploadService.uploadFile(files);
      const savedFiles = uploadedFiles.map(async (file) => {
        const savedFile = new this.fileModel({
          fileName: file.fileName,
          fileType: file.fileType,
          fileSize: file.fileSize,
          expirationDate: createFileDto.expirationDate,
          user: createFileDto.user,
          accessControl: createFileDto.accessControl,
          downloadLink: file.downloadLink,
          downloadCount: 0,
          accessList: createFileDto.accessList,
        });
        return await this.fileModel.create(savedFile);
      });
      return await Promise.all(savedFiles);
    } catch (error) {
      console.error('Error saving files:', error);
      throw new InternalServerErrorException('Failed to save files');
    }
  }
}
