// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: UserDocument): Promise<any> {
    // 查找用户是否已经存在
    const userExist = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (userExist) {
      return {
        status: 'error',
        message: '当前用户已经存在',
      };
    }
    // 创建用户
    const user = new this.userModel(createUserDto);
    await user.save();
    return this.createToken(user);
  }

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return {
        status: 'error',
        message: '用户名或密码错误',
      };
    }
    return this.createToken(user);
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
