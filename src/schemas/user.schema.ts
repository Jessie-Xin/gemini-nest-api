// src/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User &
  Document & {
    validatePassword: (password: string) => Promise<boolean>;
    changedPasswordAfter: (JWTTimestamp: number) => boolean;
  };

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' })
  role: string;

  // 密码重置时间
  @Prop()
  passwordChangedAt: Date;

  @Prop()
  passwordResetToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// 更新密码修改时间
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

UserSchema.method(
  'validatePassword',
  function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  },
);

UserSchema.method(
  'changedPasswordAfter',
  function (JWTTimestamp: number): boolean {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        (this.passwordChangedAt.getTime() / 1000).toString(),
        10,
      );
      return JWTTimestamp < changedTimestamp;
    }
    return false;
  },
);
