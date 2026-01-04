import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { OutcomesServiceModule } from './outcomes-service.module';
import { join } from 'path';
import { OUTCOMES_SERVICE_V1_PACKAGE_NAME } from "@app/common/types/outcomes_service/v1/outcomes";

async function bootstrap() {
  // Use process.cwd() - points to project root where you run the command
  const protoBasePath = join(process.cwd(), 'proto');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OutcomesServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        package: OUTCOMES_SERVICE_V1_PACKAGE_NAME,
        protoPath: [
          join(protoBasePath, 'outcomes_service/v1/models.proto'),
          join(protoBasePath, 'outcomes_service/v1/outcomes.proto'),
          join(protoBasePath, 'outcomes_service/v1/drivers.proto'),
        ],
        url: '0.0.0.0:4440',
        loader: {
          keepCase: true,
          includeDirs: [protoBasePath],
        },
      },
    }
  );

  await app.listen();
  console.log('Outcomes service running on port 4440');
}

bootstrap();