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
    .setDescription(
      `## Shacks API Documentation
      
A secure password manager backend with end-to-end encryption.

### Features
- 🔐 **User Authentication**: Session-based authentication with secure password hashing
- 🔑 **Password Management**: Store and retrieve encrypted passwords with AES encryption
- 📁 **Folder Organization**: Organize passwords into folders
- 👥 **Guardian System**: Share encrypted recovery keys with trusted guardians

### Authentication
Most endpoints require authentication via session cookie. 
1. Create an account using \`POST /users/signup\` or login with \`POST /users/login\`
2. Session cookie will be automatically set
3. Use "Authorize" button above to persist session across requests in Swagger UI

### Encryption
- Passwords are encrypted using AES with a combination of master key + user password
- Decryption happens automatically when retrieving individual passwords
- Guardian keys use cryptographically secure random generation
      `,
    )
    .setVersion('1.0')
    .setContact(
      'Shacks Support',
      'https://github.com/HydroshieldMKII/shacks',
      'support@shacks.example.com',
    )
    .addTag('users', 'User authentication and account management')
    .addTag('passwords', 'Encrypted password vault CRUD operations')
    .addTag('folders', 'Organize passwords into folders (with CASCADE delete)')
    .addTag(
      'guardians',
      'Guardian relationships for password recovery (key sharing)',
    )
    .addCookieAuth('connect.sid', {
      type: 'apiKey',
      in: 'cookie',
      name: 'connect.sid',
      description: 'Session cookie for authentication',
    })
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      syntaxHighlight: {
        activate: true,
        theme: 'monokai',
      },
      tryItOutEnabled: true,
    },
    customSiteTitle: 'Shacks API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0 }
      .swagger-ui .info .title { font-size: 36px }
      .swagger-ui .scheme-container { box-shadow: none; border-bottom: 1px solid #ddd }
    `,
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
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
