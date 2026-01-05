import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {JwtService} from "@nestjs/jwt";
import {plainToInstance} from "class-transformer";
import {ConfigService} from "@nestjs/config";
import {RefreshTokenRequest, SignInRequest, SignUpRequest} from "@app/common/types/auth_service/v1/auth";
import {AccountsService} from "../accounts/accounts.service";
import {AuthenticatedResponse} from "@app/common/types/auth_service/v1/models";
import {randomUUID} from "crypto";

@Injectable()
export class AuthenticationService {

    constructor(private prisma: PrismaService, private jwtService: JwtService, private config: ConfigService, private accountsService: AccountsService) {
    }

    async signUp(request: SignUpRequest): Promise<AuthenticatedResponse> {

        const userId = randomUUID();

        const account = await this.accountsService.create({
            user_id: userId,
            email: request.email,
            password: request.password,
        })
        return {
            user: {
                id: account.user_id,
                name: "Test Name",
                email: account.email
            },
            token: this.jwtService.sign({
                sub: account.user_id,
                email: request.email
            })
        }
    }


    async signIn(request: SignInRequest) {
        const account = await this.prisma.account.findFirst({
            where: {
                email: request.email,
                password: request.password
            }
        })

        if (!account) {
            throw new UnauthorizedException("Invalid email or password");
        }

        return {
            user: {
                id: account.user_id,
                name: "Test Name",
                email: account.email
            },
            token: this.jwtService.sign({
                sub: account.user_id,
                email: account.email
            })
        }
    }

    async refreshToken(request: RefreshTokenRequest) {


        const decryptedUser = this.jwtService.verify(request.token)


        const account = await this.prisma.account.findFirst({
            where: {
                email: decryptedUser.email,
            }
        })
        if (!account) {
            throw new UnauthorizedException("Invalid token");
        }
        return {
            user: {
                id: account.user_id,
                name: "Test Name",
                email: account.email
            },
            token: this.jwtService.sign({
                sub: account.user_id,
                email: account.email
            })
        }

    }
}
