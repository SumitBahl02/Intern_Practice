import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //  Enable global validation
  app.useGlobalPipes(new ValidationPipe());
  //   whitelist: true,         // strips unrecognized properties
  //   forbidNonWhitelisted: true, // throws error if extra properties found
  //   transform: true          // auto-transform payloads to DTO instances
  // }));

  // Simple logging middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    Logger.log(`${req.method} ${req.url}`, 'Request');
    next();
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('User API')
    .setDescription('CRUD API for managing users')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Available at http://localhost:3001/api

  await app.listen(3001);
}
void bootstrap();
