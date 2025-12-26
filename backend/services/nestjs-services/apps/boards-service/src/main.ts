import {NestFactory} from '@nestjs/core';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {BoardsModule} from "./boards/boards.module";
import { join } from 'path';
import {BOARDSSERVICE_PACKAGE_NAME} from "@app/common";

async function bootstrap() {


  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      BoardsModule,
      {
        transport: Transport.GRPC,
        options: {
            url: '0.0.0.0:4011',
          protoPath: join(__dirname, "../boardsservice.proto"),
          package: BOARDSSERVICE_PACKAGE_NAME
        }
      }
  )

  await app.listen() // default port is 5000
}
bootstrap();
