import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        // type: "OAuth2",
        user: 'mohammadelsayed002@gmail.com',
        clientId: process.env.GOOGLEGOOGLE_CLIENT_ID_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // pass: process.env.NODEMAILER_PASSWORD
      },
      // tls: {
      //     rejectUnauthorized: false
      // }
    });
  }

  async sendVerificationCode(email: string, code: string) {
    const mailOptions = {
      from: 'mohammadelsayed002@gmail.com',
      to: email,
      subject: 'Password Reset Verification Code - Flower Obsession',
      text: `Your verification code is ${code}. The code will expire after 30 minutes.`,
      html: `<p>Hello There</p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
