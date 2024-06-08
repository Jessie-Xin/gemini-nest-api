import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, MessageType } from 'src/schemas/chat.schema';
import { CustomException } from 'src/common/exceptions/custom.exception';

@Injectable()
export class ChatService {
  constructor(
    private configService: ConfigService,
    private genAI: GoogleGenerativeAI,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
  ) {
    this.genAI = new GoogleGenerativeAI(
      this.configService.get('GOOGLE_API_KEY'),
    );
  }

  async createOrUpdateChat(createChatDto: CreateChatDto) {
    const { userId, message, chatId } = createChatDto;
    let chat: Chat;
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ];

    const model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      safetySettings,
    });

    if (chatId) {
      // 查找现有聊天
      chat = await this.chatModel.findById(chatId);
      if (!chat) {
        throw new CustomException(`对话不存在`); // 自定义消息
      }
    } else {
      // 创建新聊天
      chat = new this.chatModel({
        user: userId,
        title: this.extractTitleFromMessage(message),
        messages: [],
      });
    }

    // 调用 Google Gemini 生成回复
    const chatHistory = chat.messages;
    const chatSession = model.startChat({
      history: [
        // {
        //   role: 'user',
        //   parts: [{ text: 'Hello, I have 2 dogs in my house.' }],
        // },
        // {
        //   role: 'model',
        //   parts: [{ text: 'Great to meet you. What would you like to know?' }],
        // },
      ],
      generationConfig: { maxOutputTokens: 500 },
    });

    const result = await chatSession.sendMessageStream(message);
    let responseText = '';
    for await (const chunk of result.stream) {
      responseText += chunk.text();
    }

    // 添加用户消息和AI回复到消息列表
    chat.messages.push(
      { role: MessageType.User, content: message },
      { role: MessageType.Assistant, content: responseText },
    );

    await chat.save();

    return {
      chatId: chat.id,
      message: responseText,
    };
  }

  async findChatList(id: string) {
    const chatList = await this.chatModel.find(
      { user: id },
      { _id: 1, title: 1 },
    ); // 只选择 _id 和 title 字段
    return {
      total: chatList.length,
      history: chatList,
    };
  }

  // 查找单个聊天详情
  async findChatDetail(id: string) {
    return await this.chatModel.findById(id);
  }
  // 更新聊天名称
  async updateTitle(id: string, updateChatDto: UpdateChatDto) {
    return await this.chatModel.findByIdAndUpdate(id, updateChatDto, {
      new: true,
    });
  }

  async remove(id: string) {
    return await this.chatModel.findByIdAndDelete(id);
  }

  // 从消息中提取标题的方法
  private extractTitleFromMessage(message: string): string {
    // 你可以使用正则表达式、自然语言处理库或其他方法来提取标题
    // 这里提供一个简单的示例，截取消息的前20个字符作为标题
    return message.length > 10 ? message.substring(0, 10) + '...' : message;
  }
}
