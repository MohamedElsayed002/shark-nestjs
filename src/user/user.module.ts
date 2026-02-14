import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from 'src/schemas/auth.schema';
import { PasswordHashService } from 'src/auth/services/password-hasher.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, PasswordHashService],
})
export class UserModule {}
