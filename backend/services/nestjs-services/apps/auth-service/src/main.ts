import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AuthServiceModule } from './auth-service.module';
import { join } from 'path';
import {AUTH_SERVICE_V1_PACKAGE_NAME} from "@app/common/types/auth_service/v1/auth";

async function bootstrap() {
  // Use process.cwd() - points to project root where you run the command
  const protoBasePath = join(process.cwd(), 'proto');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        package: AUTH_SERVICE_V1_PACKAGE_NAME,
        protoPath: [
          join(protoBasePath, 'auth_service/v1/accounts.proto'),
            join(protoBasePath, 'auth_service/v1/auth.proto'),
        ],
        url: '0.0.0.0:4460',
        loader: {
          keepCase: true,
          includeDirs: [protoBasePath],
        },
      },
    }
  );

  await app.listen();
  console.log('Auth service running on port 4460');
}

bootstrap();