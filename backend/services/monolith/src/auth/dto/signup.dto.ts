import {IsEmail, IsNotEmpty, IsString, MinLength} from "class-validator";

export class SignUpDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    company: string;
}
