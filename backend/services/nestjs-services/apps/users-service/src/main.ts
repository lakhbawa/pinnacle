import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { UsersServiceModule } from './users-service.module';
import { join } from 'path';
import {USERS_SERVICE_V1_PACKAGE_NAME} from "@app/common/types/users_service/v1/users";

async function bootstrap() {
  // Use process.cwd() - points to project root where you run the command
  const protoBasePath = join(process.cwd(), 'proto');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        package: USERS_SERVICE_V1_PACKAGE_NAME,
        protoPath: [
          join(protoBasePath, 'users_service/v1/users.proto'),
        ],
        url: '0.0.0.0:4450',
        loader: {
          keepCase: true,
          includeDirs: [protoBasePath],
        },
      },
    }
  );

  await app.listen();
  console.log('Users service running on port 4050');
}

bootstrap();