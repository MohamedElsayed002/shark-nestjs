import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ServicesModule } from './services/services.module';
import { HelpCenterModule } from './help-center/help-center.module';
import { ConversationModule } from './conversation/conversation.module';
import { SellModule } from './sell/sell.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    MailModule,
    AuthModule,
    UserModule,
    ServicesModule,
    HelpCenterModule,
    ConversationModule,
    SellModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
