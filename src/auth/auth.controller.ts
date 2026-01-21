import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/auth.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { AuthGuard } from 'src/guard/auth-guard';
import { type Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authSerivce: AuthService) {}

  @Post('register')
  async registerUser(@Body() data: CreateUserDto) {
    return this.authSerivce.registerUser(data);
  }

  @Post('login')
  async loginUser(
    @Body() data: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authSerivce.login(data, res);
  }

  @UseGuards(AuthGuard)
  @SetMetadata('roles', ['Admin'])
  @Get()
  async getAllUsers() {
    return this.authSerivce.findAll();
  }

  @Get(':id')
  async getSingleUser(@Param('id', ParseObjectIdPipe) id: string) {
    return this.authSerivce.findById(id);
  }
}
