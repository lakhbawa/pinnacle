import { Injectable } from '@nestjs/common';
import { Seeder } from './seeder.interface';
import {PrismaService} from "../../prisma.service";
import {OutcomesService} from "../../outcomes/outcomes.service";

@Injectable()
export class OutcomesSeeder implements Seeder {
  constructor(private readonly prisma: PrismaService, private outcomesService: OutcomesService) {}

  async run(): Promise<void> {
    const outcomes = [{
        'user_id': 'sdfsadf',
        'title': 'First Outcome',
        "why_it_matters": "Critical for Series A fundraising and market validation",
  "success_metric_value": 1000,
  "success_metric_unit": "active users",
  "deadline": "2025-06-30T23:59:59Z"
    },];

    for (const outcome of outcomes) {
      await this.outcomesService.create(outcome);
    }

    console.log('Outcomes seeded');
  }

  async clear(): Promise<void> {
    await this.prisma.outcome.deleteMany();
  }
}