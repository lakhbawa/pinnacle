import { NestFactory } from '@nestjs/core';
import { BoardsModule } from './boards.module';

async function bootstrap() {
  const app = await NestFactory.create(BoardsModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
