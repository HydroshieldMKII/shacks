import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import session from 'express-session';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Enable cookie parser
  app.use(cookieParser());

  // Throw error if SESSION_SECRET is not set
  if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  // Configure session
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      },
    }),
  );

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Convert types automatically (e.g., string to number)
      },
    }),
  );

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Shacks Password Manager API')
    .setDescription('API documentation for Shacks password manager backend')
    .setVersion('1.0')
    .addTag('users', 'User authentication and management')
    .addTag('passwords', 'Password vault operations')
    .addTag('folders', 'Folder management')
    .addTag('guardians', 'Guardian key management')
    .addCookieAuth('connect.sid', {
      type: 'apiKey',
      in: 'cookie',
      name: 'connect.sid',
    })
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
    customSiteTitle: 'Shacks API Docs',
    customCss: '.swagger-ui .topbar .download-url-wrapper { display: none }',
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `Swagger UI available at: http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}
bootstrap();
