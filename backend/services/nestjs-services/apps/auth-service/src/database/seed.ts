import { NestFactory } from '@nestjs/core';
import {SeederModule} from "./seeders/seeder.module";
import {SeederService} from "./seeders/seeder.service";
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule, {
    logger: ['error', 'warn'],
  });

    const config = app.get(ConfigService);
  console.log('DATABASE_URL:', config.get('DATABASE_URL'));

  const args = process.argv.slice(2);
  const seeder = app.get(SeederService);

  try {
    if (args.includes('--refresh')) {
      await seeder.refresh();
    } else {
      await seeder.seed();
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();