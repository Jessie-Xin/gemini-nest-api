import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema'; // 导入 User 模型

export enum MessageType {
  User = 'user',
  Assistant = 'assistant',
  System = 'system',
}

@Schema()
export class Message {
  @Prop({ required: true })
  role: MessageType;

  @Prop({ required: true })
  content: string;
}

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId, // 使用 ObjectId 类型关联用户模型
    ref: 'User', // 指定关联的模型名称
    required: true,
    index: true,
  })
  user: User; // 直接使用 User 类型

  @Prop()
  title?: string;

  @Prop({ type: [Message], required: true })
  messages: Message[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
ChatSchema.index({ userId: 1 });
