import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  create(@Body() createSubscriberDto: CreateSubscriberDto, @Req() req) {
    return this.subscribersService.create(createSubscriberDto, req.user.data);
  }

  @Get('all')
  findAll() {
    return this.subscribersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscriberDto: UpdateSubscriberDto,
  ) {
    return this.subscribersService.update(id, updateSubscriberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscribersService.remove(id);
  }
}
