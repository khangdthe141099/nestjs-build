import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public } from '../decorators/auth.decorator';
import { MailerService } from '@nestjs-modules/mailer';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly mailerService: MailerService,
  ) {}

  @Cron(CronExpression.EVERY_2_HOURS)
  handleCron() {
    console.log('call me');
  }

  @Get('send')
  @Public()
  async handleTestEmail() {
    await this.mailerService
      .sendMail({
        to: 'damtuankhanglm1@gmail.com', //Địa chỉ email người nhận
        from: 'noreply@nestjs.com', //Tiêu đề email - ai gửi tới
        subject: 'Testing Nest MailerModule ✔',
        //test chính là tên file test.hbs (html của phần body template khi gửi mail)
        //Để Nestjs bắt được code trong file này -> cần thêm config phần assets trong file nest-cli.json
        template: 'test',
        //Truyền động tham số sang template:
        context: {
          name: 'Dam Tuan Khang',
        },
      })
      .then(() => {})
      .catch(() => {});
  }
}
