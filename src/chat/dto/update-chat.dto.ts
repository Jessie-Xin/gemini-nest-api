import { IsString, IsOptional } from 'class-validator';

export class UpdateChatDto {
  @IsString({ message: '聊天标题必须是字符串类型' })
  @IsOptional()
  title: string;
}
