import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Personnaliser les options CORS
  app.enableCors({
    origin: process.env.CLIENT_URL, // Autoriser les requêtes depuis votre frontend
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(4000);
}
bootstrap();
