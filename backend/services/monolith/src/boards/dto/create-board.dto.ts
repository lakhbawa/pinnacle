import {IsAlphanumeric, IsString, MinLength} from "class-validator";

export class CreateBoardDto {

    @IsString()
    @MinLength(3)
    title: string;
}
