import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatSchema, Chat } from 'src/schemas/chat.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserSchema, User } from 'src/schemas/user.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService, GoogleGenerativeAI],
})
export class ChatModule {}
