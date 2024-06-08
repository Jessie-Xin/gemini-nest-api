import { IsNotEmpty, IsString, IsOptional, IsMongoId } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty({ message: '消息内容不能为空' })
  @IsString({ message: '消息内容必须是字符串类型' })
  message: string;

  @IsNotEmpty({ message: '用户 ID 不能为空' })
  @IsMongoId({ message: '用户 ID 格式错误' })
  userId: string;

  @IsString({ message: '聊天标题必须是字符串类型' })
  @IsOptional()
  title?: string;

  @IsOptional()
  chatId?: string;
}
