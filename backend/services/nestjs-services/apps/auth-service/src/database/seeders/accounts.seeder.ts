import { Injectable } from '@nestjs/common';
import { Seeder } from './seeder.interface';
import {PrismaService} from "../../prisma.service";
import {AuthenticationService} from "../../authentication/authentication.service";

@Injectable()
export class AccountsSeeder implements Seeder {
  constructor(private readonly prisma: PrismaService, private authenticationService: AuthenticationService) {}

  async run(): Promise<void> {
    const accounts = [{
        'name': 'Administrator',
        'email' : 'admin@admin.com',
        'company': 'Administrator',
        'password': 'password',
    },
    {
        'name': 'Test User',
        'email' : 'test@test.com',
        'company': 'Test User Company',
        'password': 'password',
    },
    ];

    for (const account of accounts) {
      await this.authenticationService.signUp(account);
    }

    console.log('Accounts seeded');
  }

  async clear(): Promise<void> {
    await this.prisma.account.deleteMany();
  }
}