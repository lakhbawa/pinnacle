import { NestFactory, Reflector } from '@nestjs/core';
import { MonolithModule } from './monolith.module';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(MonolithModule);

  app.enableCors();

  // Request validation & transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Response serialization
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  await app.listen(process.env.PORT ?? 4000);
}

bootstrap();
