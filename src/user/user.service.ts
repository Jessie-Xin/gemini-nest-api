import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { FindUserDto } from './dto/find-user.dto';
import { CustomException } from 'src/common/exceptions/custom.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  async findAll({ page, limit, sort, select }: FindUserDto): Promise<User[]> {
    const skip = (page - 1) * limit;
    const sortObj = {};
    if (sort) {
      const [key, order] = sort.split(':');
      sortObj[key] = order === 'desc' ? -1 : 1;
    }
    return await this.userModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort(sortObj)
      .select(select)
      .exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new CustomException('没有找到该用户');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    console.log('updatedUser', updatedUser);

    if (!updatedUser) {
      // 如果没有找到用户，则抛出异常
      throw new CustomException('没有找到该用户');
    }
    return updatedUser;
  }

  async remove(id: string): Promise<string> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new CustomException('没有找到该用户');
    }
    return `User with id ${id} successfully removed`;
  }
}
