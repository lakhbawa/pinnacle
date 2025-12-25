import { Module } from '@nestjs/common';
import { BoardsServiceController } from './boards-service.controller';
import { BoardsServiceService } from './boards-service.service';

@Module({
  imports: [],
  controllers: [BoardsServiceController],
  providers: [BoardsServiceService],
})
export class BoardsServiceModule {}
