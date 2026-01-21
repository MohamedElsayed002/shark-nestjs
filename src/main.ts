import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

let appInstance: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));

  await app.init();
  appInstance = app;
  return app;
}

// For local development
if (require.main === module) {
  bootstrap().then(app => {
    app.listen(process.env.PORT ?? 3000);
  });
}

// Export app instance for Vercel
export { bootstrap, appInstance };
