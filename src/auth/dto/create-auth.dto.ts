import { IsString, IsEmail, MinLength } from 'class-validator';

// 导出CreateUserDto类
export class CreateUserDto {
  // 声明name属性，并使用IsString验证器验证是否为字符串
  @IsString({ message: '姓名必须是字符串' })
  readonly name: string;

  // 声明email属性，并使用IsEmail验证器验证是否为电子邮件
  @IsEmail({}, { message: '请输入有效的电子邮件地址' })
  readonly email: string;

  // 声明password属性，并使用IsString验证器验证是否为字符串，以及MinLength验证器验证长度是否至少为8
  @IsString({ message: '密码必须是字符串' })
  @MinLength(8, { message: '密码长度至少为8个字符' })
  readonly password: string;
}
