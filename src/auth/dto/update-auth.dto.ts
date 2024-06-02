import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

// 导出UpdateUserDto类
export class UpdateUserDto {
  // 验证name是否为字符串类型，是否为可选，如果是，则只读
  @IsString({ message: '姓名必须是字符串' })
  @IsOptional()
  readonly name?: string;

  // 验证email是否为电子邮件类型，是否为可选，如果是，则只读
  @IsEmail({}, { message: '请输入有效的电子邮件地址' })
  @IsOptional()
  readonly email?: string;

  // 验证password是否为字符串类型，最小长度为8，是否为可选，如果是，则只读
  @IsString({ message: '密码必须是字符串' })
  @MinLength(8, { message: '密码长度至少为8个字符' })
  @IsOptional()
  readonly password?: string;
}
