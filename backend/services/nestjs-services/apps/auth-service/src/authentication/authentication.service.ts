import {Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {RefreshTokenRequest, SignInRequest, SignUpRequest} from "@app/common/types/auth_service/v1/auth";
import {AccountsService} from "../accounts/accounts.service";
import {AuthenticatedResponse} from "@app/common/types/auth_service/v1/models";
import {randomUUID} from "crypto";
import {Status} from "@grpc/grpc-js/build/src/constants";
import {RpcException} from "@nestjs/microservices";
import {USERS_SERVICE_NAME, UsersServiceClient} from "@app/common/types/users_service/v1/users";
import * as microservices from "@nestjs/microservices";
import {firstValueFrom} from "rxjs";

@Injectable()
export class AuthenticationService {
    private userService: UsersServiceClient;

    constructor(private prisma: PrismaService, private jwtService: JwtService, private config: ConfigService, private accountsService: AccountsService, @Inject(USERS_SERVICE_NAME) private client: microservices.ClientGrpc) {
    }

    onModuleInit(): any {
        this.userService = this.client.getService<UsersServiceClient>(USERS_SERVICE_NAME);
    }

    async signUp(request: SignUpRequest): Promise<AuthenticatedResponse> {
        // Convert Observable to Promise and await it
        const user = await firstValueFrom(
            this.userService.createUser({
                name: request.name,
                email: request.email,
                company: request.company,
            })
        );

        if (!user) {
            throw new RpcException({
                code: Status.INTERNAL,
                message: "User could not be created",
            });
        }

        const account = await this.accountsService.create({
            user_id: user.id,
            email: user.email,
            password: request.password,
        });

        return {
            user: {
                id: account.user_id,
                name: user.name,
                email: account.email
            },
            token: this.jwtService.sign({
                sub: account.user_id,
                email: request.email
            })
        };
    }


    async signIn(request: SignInRequest) {
        const account = await this.prisma.account.findFirst({
            where: {
                email: request.email,
                password: request.password
            }
        })

        if (!account) {
            throw new RpcException({
                code: Status.PERMISSION_DENIED,
                message: "Invalid Email or Password",
            });
        }

        const user = await firstValueFrom(
            this.userService.getUser({
                id: account.user_id
            })
        );

        if (!user) {
            throw new RpcException({
                code: Status.INTERNAL,
                message: "User not found",
            });
        }

        return {
            user: {
                id: user.id,
                name: user.name,
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
