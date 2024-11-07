import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './entities/file.entity';
import { AzureService } from './azure.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  ],
  controllers: [FileController],
  providers: [FileService, AzureService],
})
export class FileModule {}
