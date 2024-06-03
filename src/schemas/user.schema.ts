// src/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
export type UserDocument = User & Document;

@Schema()
export class User {
  constructor(private jwtService: JwtService) {}
  @Prop()
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop()
  passwordResetToken: string;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
  // 生成密码重置token

  createPasswordResetToken(): string {
    const resetToken = this.jwtService.sign(
      {
        id: this._id,
        email: this.email,
      },
      {
        expiresIn: '10m',
      },
    );
    this.passwordResetToken = resetToken;
    return resetToken;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
UserSchema.methods.createPasswordResetToken =
  User.prototype.createPasswordResetToken;
