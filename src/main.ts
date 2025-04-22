import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:8100',      // Ionic dev server
      'capacitor://localhost',      // Para Capacitor
      'http://localhost',           // Localhost alternativo
      'https://tudominio.com'       // Producción
    ],
    methods: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept'
    ],
    exposedHeaders: ['Authorization'],
    credentials: true,
    maxAge: 86400, // 24 horas
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  console.log("PORT", process.env.PORT ?? 3001);
  
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
