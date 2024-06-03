// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail({ email, subject, message }) {
    const mailOptions = {
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: message, // plain text body
      // html: '<b>Hello world?</b>' // html body
    };
    await this.mailerService.sendMail(mailOptions);
  }
}
