import {NestFactory} from '@nestjs/core';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import { OutcomesServiceModule } from './outcomes-service.module';
import { join } from 'path';
import {outcomes} from "@app/common";

async function bootstrap() {


  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      OutcomesServiceModule,
      {
        transport: Transport.GRPC,
        options: {
            url: '0.0.0.0:4440',
          protoPath: join(__dirname, "../outcomes.proto"),
          package: outcomes.OUTCOMES_V1_PACKAGE_NAME
        }
      }
  )

  await app.listen() // default port is 5000
}
bootstrap();
