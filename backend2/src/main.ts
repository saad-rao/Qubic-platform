import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api')

    // Enable CORS for frontend communication
  app.enableCors();

  // Enable global validation pipe for DTOs
  app.useGlobalPipes(new ValidationPipe());

  // Swagger setup
  const config = new DocumentBuilder()
    .setDescription('API documentation for the Qubic Ambassador Backend API')
    .setVersion('1.0')
    .addTag('auth', 'Authentication and user management')
    .addTag('users', 'User profiles')
    .addTag('mail', 'Email service')
    .addTag('seed', 'Database seeding for local development')
    .addTag('contributions', 'Contributions management')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();