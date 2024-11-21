import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type FileLogsDocument = FileLogs & Document;

@Schema({ timestamps: true })
export class FileLogs {
  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'File' })
  fileId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  Date: Date;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    required: true,
  })
  users: mongoose.Schema.Types.ObjectId[];

  @Prop({ required: true })
  downloadCount: number;
}

export const FileLogsSchema = SchemaFactory.createForClass(FileLogs);
