import { Injectable } from '@nestjs/common';
import { Seeder } from './seeder.interface';
import {PrismaService} from "../../prisma.service";
import {md5} from "../../../utils/misc";
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
        'name': 'Sample User',
        'email' : 'user@user.com',
        'company': 'Sample User Company',
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