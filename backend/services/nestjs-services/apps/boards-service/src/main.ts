import { NestFactory } from '@nestjs/core';
import { BoardsServiceModule } from './boards-service.module';

async function bootstrap() {
  const app = await NestFactory.create(BoardsServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
