import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { PasswordHashService } from 'src/auth/services/password-hasher.service';
import { Auth } from 'src/schemas/auth.schema';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectModel(Auth.name) private authModel: Model<Auth>,
    private readonly passwordHasher: PasswordHashService,
    private readonly mailService: MailService,
    private authService: AuthService,
  ) {}

  async forgotPassword(email: string) {
    const user = await this.authModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('Email not found');
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString(); // 6-digit code

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);
    user.verificationCode = verificationCode;
    user.codeExpiresAt = expiresAt;
    await user.save();
    this.mailService.sendVerificationCode({ to: email, code: verificationCode }).catch((err) => {
      this.logger.warn(`Verification email failed for ${email}: ${err?.message ?? err}`);
    });
    return { message: 'Verification code sent to your email' };
  }

  async verifyCode(
    email: string,
    code: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.authModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('Email Not found');
    }

    if (!user.verificationCode) {
      throw new BadRequestException(
        'No verification code found. Request a new one',
      );
    }

    if (user.codeExpiresAt && new Date() > user.codeExpiresAt) {
      user.verificationCode = '';
      user.codeExpiresAt = new Date();
      await user.save();
      throw new BadRequestException(
        'Verificaiton code expired. Please request a new one.',
      );
    }

    if (user.verificationCode !== code) {
      throw new BadRequestException('Invalid verificaiton code');
    }

    user.verificationCode = '';
    user.codeExpiresAt = new Date();
    await user.save();
    return {
      success: true,
      message: 'Verification successful. You can now reset your password',
    };
  }

  async forgotPasswordComplete(
    email: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.authModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('Email not found');
    }

    if (user.verificationCode) {
      throw new BadRequestException(
        'Verfication code not confirmed. Please verify code first',
      );
    }

    if (newPassword.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters long.',
      );
    }

    const hashPassword = await this.passwordHasher.hash(newPassword);

    user.password = hashPassword;
    await user.save();

    return {
      message: 'Password changed successfully',
    };
  }


  // Find Partner
  async getUser(id: string): Promise<Auth> {
    const user = await this.authModel.findById(id).exec()

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async getUserFindPartner(id: string): Promise<Auth> {
    const user = await this.authModel.findById(id)
    .select("_id name email location phone gender firstName lastName country partnerDescription imageUrl")
    .exec()

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async getAllUsers() {
    return this.authModel.find().exec()
  }

  async getUserType(type: string) {
    const users = await this.authModel.find({accountType: type})
      .select("_id name email location phone gender firstName lastName country partnerDescription imageUrl")

    return users
  }
}
