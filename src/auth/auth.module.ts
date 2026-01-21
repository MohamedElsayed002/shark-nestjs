import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from 'src/schemas/auth.schema';
import { JwtModule } from '@nestjs/jwt';
import { PasswordHashService } from './services/password-hasher.service';
import { TokenService } from './services/token.service';
import { AuthRepository } from './repositories/auth.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordHashService, TokenService, AuthRepository],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
