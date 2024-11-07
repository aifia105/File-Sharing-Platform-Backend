import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type FileDocument = File & Document;

@Schema({ timestamps: true })
export class File {
  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  fileType: string;

  @Prop({ required: true })
  fileSize: number;

  @Prop({ required: true })
  expirationDate: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, enum: ['public', 'private'] })
  accessControl: string;

  @Prop({ required: true })
  fileLink: string;

  @Prop({ required: true })
  downloadCount: number;

  @Prop({ required: true })
  accessList: string[];
}

export const FileSchema = SchemaFactory.createForClass(File);
