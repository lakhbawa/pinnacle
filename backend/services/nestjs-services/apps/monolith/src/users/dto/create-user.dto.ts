import {Match} from "../../utils/match.decorator";
import {IsAlpha, IsAlphanumeric, IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength} from "class-validator";

export class CreateUserDto {

    @IsNotEmpty()
    @MinLength(6)
    name: string

    @IsOptional()
    @IsAlphanumeric()
    company?: string

    @IsEmail()
    email: string

    @IsNotEmpty()
    @MaxLength(255)
    @MinLength(5)
    password: string

    @Match('password')
    password_confirmation: string
}
