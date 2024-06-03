// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail({ email, subject, message }) {
    const mailOptions: ISendMailOptions = {
      from: '"Fred Foo 👻" <foo@example.com>',
      to: email,
      subject: subject,
      // text: message, // 纯文本内容
      html: `<p>${message}</p>`, // HTML 内容，可以使用模板引擎来渲染动态内容
    };
    await this.mailerService.sendMail(mailOptions);
  }
}
