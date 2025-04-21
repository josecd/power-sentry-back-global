import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:8100', // Desarrollo Ionic
      'http://localhost:4200', // Angular dev
      'https://tudominio.com',  // Producción
      'capacitor://localhost', // Para apps móviles
      'http://localhost'        // Localhost alternativo
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
