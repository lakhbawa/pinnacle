import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { OutcomesServiceModule } from './outcomes-service.module';
import { join } from 'path';
import { OUTCOMES_SERVICE_V1_PACKAGE_NAME } from "@app/common/types/outcomes_service/v1/outcomes";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const logger = new Logger('OutcomesService');
  const protoBasePath = join(process.cwd(), 'proto');

  // Create hybrid app (HTTP + gRPC)
  const app = await NestFactory.create(OutcomesServiceModule);

  // Add gRPC microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: OUTCOMES_SERVICE_V1_PACKAGE_NAME,
      protoPath: [
        join(protoBasePath, 'outcomes_service/v1/models.proto'),
        join(protoBasePath, 'outcomes_service/v1/outcomes.proto'),
        join(protoBasePath, 'outcomes_service/v1/drivers.proto'),
        join(protoBasePath, 'outcomes_service/v1/actions.proto'),
        join(protoBasePath, 'outcomes_service/v1/focus.proto'),
      ],
      url: '0.0.0.0:4440',
      loader: {
        keepCase: true,
        includeDirs: [protoBasePath],
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(4441, '0.0.0.0');

  logger.log('HTTP (metrics) on :4441, gRPC on :4440');
}
bootstrap();