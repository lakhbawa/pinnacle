import {Module} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {JwtModule, JwtModuleOptions} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {ConfigService} from "@nestjs/config";
import {AccountsService} from "../accounts/accounts.service";
import {AuthenticationController} from "./authentication.controller";
import {AuthenticationService} from "./authentication.service";

@Module({

    imports: [
        PassportModule,
        JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.get<string>('app.jwt.secret') || 'fallback-secret',
        signOptions: {
            expiresIn: config.get<number>('app.jwt.expiresIn') || '300'
        }
    })
})
    ],
    controllers: [AuthenticationController],
    providers: [AuthenticationService,
        PrismaService,
        AccountsService,
    ],
})
export class AuthenticationModule {
}
