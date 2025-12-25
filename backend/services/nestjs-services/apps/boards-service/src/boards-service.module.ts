import { Module } from '@nestjs/common';
import { BoardsServiceController } from './boards-service.controller';
import { BoardsServiceService } from './boards-service.service';
import { BoardsModule } from './boards/boards.module';

@Module({
  imports: [BoardsModule],
  controllers: [BoardsServiceController],
  providers: [BoardsServiceService],
})
export class BoardsServiceModule {}
