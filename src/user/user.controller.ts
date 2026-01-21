import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guard/auth-guard';

@Controller('user')
export class UserController {
  constructor(private readonly userSerivce: UserService) {}

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.userSerivce.forgotPassword(body.email);
  }

  @Post('verify-code')
  async verifyCode(@Body() body: { email: string; code: string }) {
    return this.userSerivce.verifyCode(body.email, body.code);
  }

  @Post('complete-reset')
  async completeReset(@Body() body: { email: string; password: string }) {
    return this.userSerivce.forgotPasswordComplete(body.email, body.password);
  }

  @UseGuards(AuthGuard)
  @SetMetadata('roles', ['Admin', 'User'])
  @Get('me')
  async userInfo(@Req() req: { user: UserData }) {
    return this.userSerivce.getUser(req.user._id);
  }
}
