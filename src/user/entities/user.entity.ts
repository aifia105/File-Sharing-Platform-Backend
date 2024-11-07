import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  picture: string;
  @Prop({ required: true })
  phoneNumber: string;
  @Prop({ required: true })
  filesNumber: number;
  _id: mongoose.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 }, { unique: true });
