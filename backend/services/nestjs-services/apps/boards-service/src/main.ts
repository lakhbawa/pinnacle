import {NestFactory} from '@nestjs/core';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {BoardsModule} from "./boards/boards.module";
import { join } from 'path';
import { BoardsService} from "@app/common";

async function bootstrap() {


  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      BoardsModule,
      {
        transport: Transport.GRPC,
        options: {
          protoPath: join(__dirname, "../boardsservice.proto"),
          package: BoardsService
        }
      }
  )

  await app.listen()
}
bootstrap();
