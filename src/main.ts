import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet'

// npm install --production

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
