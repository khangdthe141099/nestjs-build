import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  async updateHashedRefreshToken(userId: number, hashedRefreshToken: string) {
    return this.userModel.updateOne({ id: userId }, { hashedRefreshToken });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll() {
    const users = await this.userModel.find();
    if (users && users.length) {
      return {
        data: users,
        success: true,
      };
    }

    return {
      data: [],
      success: true,
    };
  }

  async findDeleted() {
    const users = await this.userModel.findDeleted();
    if (users && users.length) {
      return {
        data: users,
        success: true,
      };
    }

    return {
      data: [],
      success: true,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Not found user';
    }

    try {
      const user = await this.userModel.findById(id);
      if (user) {
        return {
          data: user,
          success: true,
        };
      }

      return {
        data: {},
        success: true,
      };
    } catch (err) {
      return {
        data: {},
        error: err,
      };
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.userModel.findOne({ email });
    } catch (err) {
      return {};
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userModel.updateOne({ _id: id }, { $set: updateUserDto });

    return {
      data: updateUserDto,
      success: true,
    };
  }

  async remove(id: string) {
    await this.userModel.softDelete({ _id: id });
  }

  async removeAll() {
    await this.userModel.deleteMany({});
    return {
      success: true,
      message: 'All users have been removed',
    };
  }
}
