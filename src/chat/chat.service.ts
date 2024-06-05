import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ChatService {
  constructor(
    private configService: ConfigService,
    private genAI: GoogleGenerativeAI,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    this.genAI = new GoogleGenerativeAI(
      this.configService.get('GOOGLE_API_KEY'),
    );
  }
  async create(createChatDto: CreateChatDto) {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const chatHistory: ChatModuleType.ChatMessage[] = [];
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: { maxOutputTokens: 500 },
    });
    chatHistory.push({
      role: 'user',
      parts: [{ text: createChatDto.message }],
    });
    const prompt = createChatDto.message;

    const result = await chat.sendMessageStream(prompt);
    let text = '';
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      console.log(chunkText);
      text += chunkText;
    }
    chatHistory.push({
      role: 'model',
      parts: [{ text }],
    });
    return text;
  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: string) {
    return `This action returns a #${id} chat`;
  }

  update(id: string, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: string) {
    return `This action removes a #${id} chat`;
  }
}
