import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { UsersService } from '../users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Subscriber, SubscriberDocument } from './entities/subscriber.schema';
import mongoose from 'mongoose';

@Injectable()
export class SubscribersService {
  constructor(
    private usersService: UsersService,
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,
  ) {}

  async create(createSubscriberDto: CreateSubscriberDto, user: any) {
    const { name, skills, email } = createSubscriberDto;
    const isExist = await this.subscriberModel.findOne({ email });

    if (isExist) {
      throw new BadRequestException(`Email: ${email} is already exist`);
    }

    return await this.subscriberModel.create({
      name,
      email,
      skills,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async findAll() {
    return this.subscriberModel.find();
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Not found subscribers';
    }

    return this.subscriberModel.findById(id);
  }

  async update(id: string, updateSubscriberDto: UpdateSubscriberDto) {
    await this.subscriberModel.updateOne({ _id: id }, { $set: updateSubscriberDto });
  }

  async remove(id: string) {
    await this.subscriberModel.softDelete({ _id: id });
  }
}
