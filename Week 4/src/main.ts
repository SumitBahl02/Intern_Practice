import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";

/**
 * Bootstrap function to initialize and start the NestJS application
 */
async function bootstrap(): Promise<void> {
  const logger = new Logger("Bootstrap");
  
  try {
    const app = await NestFactory.create(AppModule);

    // Global configuration
    app.useGlobalPipes(new ValidationPipe({ 
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(
      new LoggingInterceptor(),
      new ResponseInterceptor()
    );

    // Enable CORS for cross-origin requests
    app.enableCors();

    // Setup Swagger documentation
    const config = new DocumentBuilder()
      .setTitle("Advanced NestJS API")
      .setDescription("Production-ready REST API with advanced features")
      .setVersion("1.0")
      .addBearerAuth()
      .addTag("auth", "Authentication endpoints")
      .addTag("users", "User management endpoints")
      .addTag("tasks", "Task management endpoints")
      .addTag("projects", "Project management endpoints")
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);

    const port = Number(process.env.PORT) || 3000;
    await app.listen(port);
    
    logger.log(`Application running on: http://localhost:${port}`);
    logger.log(`Swagger documentation available at: http://localhost:${port}/api`);
  } catch (error) {
    if (error.code === "EADDRINUSE") {
      logger.error(`Port ${process.env.PORT || 3000} is already in use!`);
      logger.error(`Try running: "taskkill /F /IM node.exe" to kill all Node.js processes`);
      logger.error(`Or change the PORT environment variable to use a different port`);
    } else {
      logger.error(`Failed to start application: ${error.message}`);
    }
    process.exit(1);
  }
}

bootstrap();
