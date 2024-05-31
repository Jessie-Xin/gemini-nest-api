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

  async signUp(createUserDto: any): Promise<any> {
    const user = new this.userModel(createUserDto);
    await user.save();
    return this.createToken(user);
  }

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.createToken(user);
  }

  async createToken(user: UserDocument) {
    const payload = { email: user.email, sub: user._id };
    console.log('payload', payload);

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
