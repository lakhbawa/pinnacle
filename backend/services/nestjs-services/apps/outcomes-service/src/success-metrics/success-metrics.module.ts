import { Module } from '@nestjs/common';
import { SuccessMetricsService } from './success-metrics.service';
import { SuccessMetricsController } from './success-metrics.controller';
import {PrismaService} from "../prisma.service";

@Module({
  controllers: [SuccessMetricsController],
  providers: [SuccessMetricsService, PrismaService],
})
export class SuccessMetricsModule {}
