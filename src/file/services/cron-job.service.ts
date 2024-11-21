import { InternalServerErrorException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { FileService } from './file.service';

export class CronJobService {
  constructor(private readonly fileService: FileService) {}

  @Cron('0 0 24 * * *')
  async handleCron() {
    try {
      const files = await this.fileService.getFiles();
      const expiredFiles = files.filter(
        (file) => new Date(file.expirationDate) <= new Date(),
      );
      await Promise.all(
        expiredFiles.map(async (file) => {
          await this.fileService.deleteFile(file.fileName);
        }),
      );
      //notify user
    } catch (error) {
      console.error('Error handling cron job:', error);
      throw new InternalServerErrorException('Failed to handle cron job');
    }
  }

  @Cron('0 0 24 * * *')
  async notifyUserBeforeDelete() {
    try {
      const files = await this.fileService.getFiles();
      const filesToDelete = files.filter(
        (file) =>
          new Date(file.expirationDate).getTime() - new Date().getTime() <=
          86400000,
      );
      const users = filesToDelete.map((file) => file.user);
      //notify users
    } catch (error) {
      console.error('Error handling cron job:', error);
      throw new InternalServerErrorException('Failed to handle cron job');
    }
  }
}
