import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  // 创建消息
  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.createOrUpdateChat(createChatDto);
  }
  //查询该用户下的所有聊天列表
  @Get(':id/list')
  findAll(@Param('id') id: string) {
    return this.chatService.findChatList(id);
  }
  // 查询指定聊天
  @Get(':chatId/detail')
  findOne(@Param('chatId') chatId: string) {
    return this.chatService.findChatDetail(chatId);
  }
  // 更新聊天标题
  @Patch(':id/title')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.updateTitle(id, updateChatDto);
  }
  // 删除聊天
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(id);
  }
}
