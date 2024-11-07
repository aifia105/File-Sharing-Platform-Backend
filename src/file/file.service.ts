import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { File, FileDocument } from './entities/file.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AzureService } from './azure.service';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    private readonly azureService: AzureService,
  ) {}

  async saveFile(
    createFileDto: CreateFileDto,
    files: Express.Multer.File[],
  ): Promise<File[]> {
    try {
      const uploadedFiles = await this.azureService.uploadFile(files);
      const savedFiles = await Promise.all(
        uploadedFiles.map(async (file) => {
          const savedFile = new this.fileModel({
            fileName: file.fileName,
            fileType: file.fileType,
            fileSize: file.fileSize,
            expirationDate: createFileDto.expirationDate,
            user: createFileDto.user,
            accessControl: createFileDto.accessControl,
            fileLink: file.downloadLink,
            downloadCount: 0,
            accessList: createFileDto.accessList,
          });
          return await this.fileModel.create(savedFile);
        }),
      );
      return savedFiles;
    } catch (error) {
      console.error('Error saving files:', error);
      throw new InternalServerErrorException('Failed to save files');
    }
  }

  async downloadFile(fileName: string): Promise<string> {
    try {
      const file = await this.fileModel.findOne({ fileName });
      if (!file) {
        throw new HttpException('File not found', 404);
      }
      const checkAccess = await this.checkAccess(
        fileName,
        file.user.toString(),
      );
      if (!checkAccess) {
        throw new HttpException('Unauthorized access', 401);
      }
      const downloadLink = await this.azureService.downloadFile(fileName);
      if (downloadLink) {
        await this.incrementDownloadCount(fileName);
      }
      return downloadLink;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw new InternalServerErrorException('Failed to download file');
    }
  }

  async checkAccess(fileName: string, userId: string): Promise<boolean> {
    try {
      const file = await this.fileModel.findOne({ fileName });
      if (!file) {
        throw new HttpException('File not found', 404);
      }
      if (file.accessControl === 'public') {
        return true;
      }
      if (file.user.toString() === userId) {
        return true;
      }
      if (file.accessList.includes(userId)) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking access:', error);
      throw new InternalServerErrorException('Failed to check access');
    }
  }

  async incrementDownloadCount(fileName: string): Promise<void> {
    try {
      await this.fileModel.updateOne(
        { fileName },
        { $inc: { downloadCount: 1 } },
      );
    } catch (error) {
      console.error('Error incrementing download count:', error);
      throw new InternalServerErrorException(
        'Failed to increment download count',
      );
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      const file = await this.fileModel.findOne({ fileName });
      if (!file) {
        throw new HttpException('File not found', 404);
      }
      await this.azureService.deleteFile(fileName);
      await this.fileModel.deleteOne({ fileName });
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new InternalServerErrorException('Failed to delete file');
    }
  }

  async updateFileAccessList(
    fileId: string,
    newAccessList: string[],
  ): Promise<File> {
    try {
      const file = await this.fileModel.findById(fileId);
      if (!file) {
        throw new HttpException('File not found', 404);
      }
      file.accessList = newAccessList;
      return await file.save();
    } catch (error) {
      console.error('Error updating file access list:', error);
      throw new InternalServerErrorException(
        'Failed to update file access list',
      );
    }
  }
}
