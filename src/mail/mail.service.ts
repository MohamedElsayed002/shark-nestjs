import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const sendgrid = require('sendgrid');

export interface WelcomeEmailOptions {
  to: string;
  name: string;
}

export interface VerificationEmailOptions {
  to: string;
  code: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private sg: { API: (req: unknown) => Promise<unknown>; emptyRequest: (opts?: unknown) => unknown } | null = null;
  private fromEmail: string = '';

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('SENDGRID_API_KEY');
    const from = this.config.get<string>('SENDGRID_FROM_EMAIL');
    if (apiKey && from) {
      this.sg = sendgrid(apiKey);
      this.fromEmail = from;
      this.logger.log('Mail transport configured (SendGrid)');
    } else {
      this.logger.warn(
        'SENDGRID_API_KEY or SENDGRID_FROM_EMAIL not set; welcome emails will be skipped',
      );
    }
  }

  private isConfigured(): boolean {
    return this.sg !== null && this.fromEmail.length > 0;
  }

  async sendWelcomeEmail(options: WelcomeEmailOptions): Promise<void> {
    const { to, name } = options;
    if (!this.isConfigured()) {
      this.logger.warn(`Welcome email skipped (no config): ${to}`);
      return;
    }
    const helper = sendgrid.mail;
    const displayName = name?.trim() || 'User';
    const subject = 'Welcome to Shark Market';
    const text = `Welcome to Shark Market\n\nHi ${displayName},\n\nThanks for signing up. Your account has been created successfully.\n\nYou can now log in and start exploring.\n\n— The Shark Market Team`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f172a;">Welcome to Shark Market</h2>
        <p>Hi ${displayName},</p>
        <p>Thanks for signing up. Your account has been created successfully.</p>
        <p>You can now log in and start exploring.</p>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>— The Shark Market Team</p>
      </div>
    `;

    const from = new helper.Email(this.fromEmail, 'Shark Market');
    const toEmail = new helper.Email(to);
    const plainContent = new helper.Content('text/plain', text);
    const htmlContent = new helper.Content('text/html', html);
    const mail = new helper.Mail(from, subject, toEmail, plainContent);
    mail.addContent(htmlContent);

    const request = this.sg!.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });

    try {
      await this.sg!.API(request);
      this.logger.log(`Welcome email sent to ${to}`);
    } catch (err) {
      this.logger.error(`Failed to send welcome email to ${to}`, err);
      // Do not throw: registration should succeed even if email fails
    }
  }

  async sendVerificationCode(options: VerificationEmailOptions): Promise<void> {
    const { to, code } = options;
    if (!this.isConfigured()) {
      this.logger.warn(`Verification email skipped (no config): ${to}`);
      return;
    }
    const helper = sendgrid.mail;
    const subject = 'Password Reset Verification Code - Shark Market';
    const text = `Your verification code is ${code}. The code will expire after 30 minutes.`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f172a;">Password Reset</h2>
        <p>Your verification code is <strong>${code}</strong>.</p>
        <p>The code will expire after 30 minutes.</p>
        <p>— The Shark Market Team</p>
      </div>
    `;

    const from = new helper.Email(this.fromEmail, 'Shark Market');
    const toEmail = new helper.Email(to);
    const plainContent = new helper.Content('text/plain', text);
    const htmlContent = new helper.Content('text/html', html);
    const mail = new helper.Mail(from, subject, toEmail, plainContent);
    mail.addContent(htmlContent);

    const request = this.sg!.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });

    try {
      await this.sg!.API(request);
      this.logger.log(`Verification email sent to ${to}`);
    } catch (err) {
      this.logger.error(`Failed to send verification email to ${to}`, err);
    }
  }
}
