import { Injectable, Logger } from '@nestjs/common';
import { SendEmailDto } from './dto/send-email.dto';
import { ConfigService } from '@nestjs/config';
// import * as nodemailer from 'nodemailer'; // Uncomment this line to import nodemailer
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  // private transporter; // Uncomment this line to use a transporter

  constructor(private configService: ConfigService, private mailerService: MailerService) {
    // Uncomment the following code block to initialize the transporter
    // this.transporter = nodemailer.createTransport({
    //   host: this.configService.get<string>('mail.host'),
    //   port: this.configService.get<number>('mail.port'),
    //   secure: false, // true for 465, false for other ports
    //   auth: {
    //     user: this.configService.get<string>('mail.user'),
    //     pass: this.configService.get<string>('mail.pass'),
    //   },
    // });
  }

  
  async sendEmail(sendEmailDto: SendEmailDto): Promise<void> {
    const { to, subject, body } = sendEmailDto;

    // Uncomment the following code block to send the email
    // const mailOptions = {
    //   from: this.configService.get<string>('mail.from'),
    //   to,
    //   subject,
    //   html: body,
    // };
    // try {
    //   await this.transporter.sendMail(mailOptions);
    //   this.logger.log(`Email sent successfully to ${to}`);
    // } catch (error) {
    //   this.logger.error(`Failed to send email to ${to}`, error.stack);
    // }

    this.logger.log(`Placeholder: Sending email to ${to} with subject "${subject}"`);
  }

  async sendVerificationEmail(to: string, token: string) {
    // You'll need to create a verification URL that the user will click
    const url = `http://localhost:3000/auth/verify-email?token=${token}`; 

    await this.mailerService.sendMail({
      to: to,
      subject: 'Email Verification',
      html: `
        <h1>Please confirm your email address</h1>
        <p>
          Thanks for signing up! Please click the link below to verify your email.
        </p>
        <a href="${url}">Verify my email</a>
      `,
    });
  }
}