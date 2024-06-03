import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/schemas/user.schema';
import { Roles } from 'src/auth/roles.decorator';

@Controller('user')
// @Roles('admin')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sort') sort: string,
    @Query('select') select: string,
  ) {
    const data = await this.userService.findAll({ page, limit, sort, select });
    console.log(data);
    return data;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      status: 'success',
      data: await this.userService.findOne(id),
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: User) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
