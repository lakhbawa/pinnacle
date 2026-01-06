import { Injectable } from '@nestjs/common';
import { OutcomesSeeder } from './outcomes.seeder';
import {PrismaService} from "../../prisma.service";

@Injectable()
export class SeederService {
  private readonly seeders;

  constructor(
    private readonly prisma: PrismaService,
    private readonly outcomesSeeder: OutcomesSeeder,
  ) {
    this.seeders = [
      this.outcomesSeeder,
    ];
  }

  async seed(): Promise<void> {
    console.log('Starting database seed...\n');

    for (const seeder of this.seeders) {
      await seeder.run();
    }

    console.log('\n Database seeding completed!');
  }

  async refresh(): Promise<void> {
    console.log('Clearing database...\n');

    // Clear in reverse order to handle foreign keys
    for (const seeder of [...this.seeders].reverse()) {
      if (seeder.clear) {
        await seeder.clear();
      }
    }

    await this.seed();
  }
}