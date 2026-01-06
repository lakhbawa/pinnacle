import {IsNotEmpty} from "class-validator";

export class RefreshTokenDto {
    @IsNotEmpty()
    token: string;
}