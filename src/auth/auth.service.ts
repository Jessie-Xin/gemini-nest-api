// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-auth.dto';
import { CustomException } from 'src/common/exceptions/custom.exception';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    // 查找用户是否已经存在
    const userExist = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (userExist) {
      throw new CustomException(`用户已经存在`); // 自定义消息
    }
    // 创建用户
    const user = new this.userModel(createUserDto);
    console.log(user);

    await user.save();
    return this.createToken(user);
  }

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new CustomException(`用户名或密码错误`); // 自定义消息
    }
    return this.createToken(user);
  }

  //已知旧密码重置密码
  async reset(
    email: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<any> {
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
      throw new CustomException(`用户名或密码错误`); // 自定义消息
    }
    user.password = newPassword;
    await user.save();
    return this.createToken(user);
  }

  //不知道密码，忘记密码
  async forget(email: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new CustomException(`用户不存在`); // 自定义消息
    }
    const token = user.createPasswordResetToken();
    await user.save({
      validateBeforeSave: false,
    });
    //发送邮件
    const resetURL = `http://localhost:3000/resetPassword/${token}`;
    await this.mailService.sendEmail({
      email: email,
      subject: '密码重置',
      message: `点击链接重置密码：${resetURL}`,
    });
    return {
      message: '重置密码链接已发送至你的邮箱',
    };
  }
  async createToken(user: UserDocument) {
    const payload = { email: user.email, userId: user._id };
    user.password = undefined;
    return {
      status: 'success',
      token: this.jwtService.sign(payload),
      data: {
        user,
      },
    };
  }
}
