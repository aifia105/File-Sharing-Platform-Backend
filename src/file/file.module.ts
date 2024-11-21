import { Module } from '@nestjs/common';
import { FileService } from './services/file.service';
import { FileController } from './controllers/file.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './entities/file.entity';
import { AzureService } from './services/azure.service';
import { FileLogs, FileLogsSchema } from './entities/file.logs.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    MongooseModule.forFeature([
      { name: FileLogs.name, schema: FileLogsSchema },
    ]),
  ],
  controllers: [FileController],
  providers: [FileService, AzureService],
  exports: [FileService],
})
export class FileModule {}
