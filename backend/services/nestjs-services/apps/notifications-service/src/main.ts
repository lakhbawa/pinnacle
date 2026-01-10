import { NestFactory } from '@nestjs/core';
import { NotificationsServiceModule } from './notifications-service.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsServiceModule);
  const logger = new Logger('NotificationsService');

  // Enable CORS for REST API
  app.enableCors({
    origin: '*',
  });

  const port = process.env.PORT ?? 4470;
  await app.listen(port);

  logger.log(`Notifications service running on port ${port}`);
  logger.log(`WebSocket available at ws://localhost:${port}/notifications`);
}
bootstrap();