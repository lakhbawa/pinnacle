import {Module} from '@nestjs/common';
import {BoardsService} from './boards.service';
import {BoardsController} from './boards.controller';
import {BOARDS_SERVICE} from "./constants";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {BOARDSSERVICE_PACKAGE_NAME} from "@app/common";
import { join} from "path";

@Module({
  imports: [
      ClientsModule.register([
        {
          name: BOARDS_SERVICE,
          transport: Transport.GRPC,
          options: {
            package: BOARDSSERVICE_PACKAGE_NAME,
            protoPath: join(__dirname, '../boardsservice.proto'),
          }
        }
      ]),
  ],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
