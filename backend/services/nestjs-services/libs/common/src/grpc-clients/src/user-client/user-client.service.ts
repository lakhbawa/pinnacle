// libs/grpc-clients/src/user-client/user-client.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ClientGrpc, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { firstValueFrom } from 'rxjs';

interface User {
  id: string;
  email: string;
  name: string;
}

interface GetUsersResponse {
  users: User[];
}

interface UserServiceClient {
  getUsers(data: {}): Promise<GetUsersResponse>;
  getUserById(data: { id: string }): Promise<User>;
}

@Injectable()
export class UserClientService implements OnModuleInit, OnModuleDestroy {
  private client: ClientGrpc;
  private userService: UserServiceClient;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        package: 'user',
        protoPath: join(__dirname, '../../../proto/user.proto'),
        url: process.env.USER_SERVICE_URL || 'localhost:50051',
      },
    });
  }

async onModuleInit() {
    // First get the service reference
    this.userService = this.client.getService<UserServiceClient>('UserService');
    // Then connect - this was missing!
  }

async onModuleDestroy() {
    await this.client.close();
  }


  async getFirstUser(): Promise<User> {
    const response = await this.userService.getUsers({});

    if (!response.users?.length) {
      throw new Error('No users found in User Service');
    }

    return response.users[0];
  }
}