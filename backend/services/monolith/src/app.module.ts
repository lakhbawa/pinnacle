import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { BoardsModule } from './boards/boards.module';
import {Board} from "./boards/entities/board.entity";

@Module({
  imports: [
      TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 4732,
      password: 'postgres',
      username: 'postgres',
      entities: [Board],
      database: 'pinnacle',
      synchronize: true,
      logging: true,
    }),
      BoardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
