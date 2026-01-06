import {Module} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {JwtModule, JwtModuleOptions} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {AccountsService} from "../accounts/accounts.service";
import {AuthenticationController} from "./authentication.controller";
import {AuthenticationService} from "./authentication.service";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {USERS_SERVICE_NAME, USERS_SERVICE_V1_PACKAGE_NAME} from "@app/common/types/users_service/v1/users";
import {join} from 'path';

const protoBasePath = join(process.cwd(), 'proto');

@Module({

    imports: [
        ConfigModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService): JwtModuleOptions => ({
                secret: config.get<string>('app.jwt.secret') || 'fallback-secret',
                signOptions: {
                    expiresIn: config.get<number>('app.jwt.expiresIn') || '300'
                }
            })
        }),

        ClientsModule.register([
            {
                name: USERS_SERVICE_NAME,
                transport: Transport.GRPC,
                options: {
                    package: USERS_SERVICE_V1_PACKAGE_NAME,
                    protoPath: join(protoBasePath, 'users_service/v1/users.proto'),
                    url: process.env.USERS_SERVICE_URL || 'pinnacle-users-service:4450',
                    loader: {
                        keepCase: true,
                        includeDirs: [protoBasePath],
                    },
                }
            }
        ]),
    ],
    controllers: [AuthenticationController],
    providers: [AuthenticationService,
        PrismaService,
        AccountsService,
    ],
    exports: [AuthenticationService]
})
export class AuthenticationModule {
}
