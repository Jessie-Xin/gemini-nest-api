// chat.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';

@Schema()
export class Chat extends Document {
  @Prop({ type: Array })
  chatHistory: Array<{ role: string; parts: Array<{ text: string }> }>;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User; // 关联用户
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
