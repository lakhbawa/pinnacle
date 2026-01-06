import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {PrismaService} from "../prisma.service";
import {JwtModule, JwtModuleOptions} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {UsersService} from "../users/users.service";
import appConfig from "../config/app.config";
import {ConfigService} from "@nestjs/config";

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
    controllers: [AuthController],
    providers: [AuthService,
        PrismaService,
        UsersService,
    ],
})
export class AuthModule {
}
