import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

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

  // CORS — allow frontend dev server
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  })

  const port = process.env.PORT ?? 6000
  await app.listen(port)
  console.log(`Backend running at http://localhost:${port}`)
}

bootstrap()
