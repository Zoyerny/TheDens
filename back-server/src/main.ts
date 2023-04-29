import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Personnaliser les options CORS
  app.enableCors({
    origin: true, // Autoriser les requêtes depuis votre frontend
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    credentials: true,
  });

  // Utiliser cookie-parser middleware
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(4000);
}
bootstrap();
