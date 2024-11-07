import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AzureService {
  private containerName = 'file-sharing';

  private async getBlobServiceInstance(): Promise<BlobServiceClient> {
    try {
      const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
      if (!connectionString) {
        throw new HttpException('Connection string not found', 400);
      }
      const blobClientService =
        await BlobServiceClient.fromConnectionString(connectionString);
      return blobClientService;
    } catch (error) {
      console.error('Error getting BlobServiceClient instance:', error);
      throw new InternalServerErrorException(
        'Failed to get BlobServiceClient instance',
      );
    }
  }

  private async getBlobClient(imageName: string): Promise<BlockBlobClient> {
    try {
      const blobService = await this.getBlobServiceInstance();
      const containerClient = blobService.getContainerClient(
        this.containerName,
      );
      const blockBlobClient = containerClient.getBlockBlobClient(imageName);
      return blockBlobClient;
    } catch (error) {
      console.error('Error getting BlockBlobClient:', error);
      throw new InternalServerErrorException('Failed to get BlockBlobClient');
    }
  }

  async uploadFile(file: Express.Multer.File[]): Promise<
    {
      fileName: string;
      fileType: string;
      fileSize: number;
      downloadLink: string;
    }[]
  > {
    try {
      const uploadPromises = file.map(async (file) => {
        const extension = file.originalname.split('.').pop();
        const fileName = uuidv4() + '.' + extension;
        const fileType = file.mimetype;
        const fileSize = file.size;
        const blobClient = await this.getBlobClient(fileName);
        const fileUrl = blobClient.url;
        await blobClient.uploadData(file.buffer);
        return { fileName, fileType, fileSize, downloadLink: fileUrl };
      });
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading files:', error);
      throw new InternalServerErrorException('Failed to upload files');
    }
  }

  async downloadFile(fileName: string): Promise<string> {
    try {
      const blobClient = await this.getBlobClient(fileName);
      const downloadBlockBlobResponse = await blobClient.download();
      const downloaded = await this.streamToBuffer(
        downloadBlockBlobResponse.readableStreamBody,
      ).toString();
      return downloaded;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw new InternalServerErrorException('Failed to download file');
    }
  }

  private async streamToBuffer(readableStreamBody) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStreamBody.on('data', (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStreamBody.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      readableStreamBody.on('error', reject);
    });
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      const blobClient = await this.getBlobClient(fileName);
      await blobClient.deleteIfExists();
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new InternalServerErrorException('Failed to delete file');
    }
  }
}
