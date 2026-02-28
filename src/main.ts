import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Global validation pipe — uses class-validator decorators on DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // Strip unknown properties
      forbidNonWhitelisted: true,
      transform: true,       // Auto-transform payload types
    })
  )

  // Global exception filter — normalizes all HttpException errors to { messages: string[], error: string }
  app.useGlobalFilters(new HttpExceptionFilter())

  // Global interceptor — wraps all success responses in { message, result }
  const reflector = app.get(Reflector)
  app.useGlobalInterceptors(new TransformInterceptor(reflector))

  // Swagger — API documentation at /docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('LPG POS API')
    .setDescription(
      'REST API untuk aplikasi LPG POS.\n\n' +
      '**Envelope sukses:** `{ message: string, result: T }`\n\n' +
      '**Envelope error:** `{ messages: string[], error: string }`'
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'Masukkan access token atau refresh token sesuai endpoint' },
      'bearer'
    )
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  })

  // CORS — allow frontend dev server
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })

  const port = process.env.PORT ?? 6000
  await app.listen(port)
  console.log(`Backend running at http://localhost:${port}`)
}

bootstrap()
