import {Injectable, UnauthorizedException} from '@nestjs/common';
import {SignUpDto} from './dto/signup.dto';
import {SignInDto} from './dto/signin.dto';
import {PrismaService} from "../prisma.service";
import {JwtService} from "@nestjs/jwt";
import {UsersService} from "../users/users.service";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {User} from "../users/entities/user.entity";
import {plainToInstance} from "class-transformer";
import {RefreshTokenDto} from "./dto/refreshtoken.dto";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwtService: JwtService, private userService: UsersService, private config: ConfigService) {
    }

    async signup(signUpTo: SignUpDto) {

        const createUserDto = new CreateUserDto();
        createUserDto.email = signUpTo.email;
        createUserDto.password = signUpTo.password;
        createUserDto.company = signUpTo.company;
        createUserDto.name = signUpTo.name;
        const user = await this.userService.create(createUserDto)
        return {
            user: plainToInstance(User, user),
            token: this.jwtService.sign({
                sub: user.id,
                email: user.email
            })
        }
    }


    async signIn(signInDto: SignInDto) {
        const user = await this.prisma.user.findFirst({
            where: {
                email: signInDto.email,
                password: signInDto.password
            }
        })

        if (!user) {
            throw new UnauthorizedException("Invalid email or password");
        }

        return {
            user: plainToInstance(User, user),
            token: this.jwtService.sign({
                sub: user.id,
                email: user.email
            })
        }
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto) {


        const decryptedUser = this.jwtService.verify(refreshTokenDto.token)


        const user = await this.prisma.user.findFirst({
            where: {
                email: decryptedUser.email,
            }
        })
        if (!user) {
            throw new UnauthorizedException("Invalid token");
        }
        return {
            user: plainToInstance(User, user),
            token: this.jwtService.sign({
                sub: user.id,
                email: user.email
            })
        }

    }
}
