import {IsString, MinLength} from "class-validator";

export class CreateProjectDto {

    @IsString()
    @MinLength(3)
    title: string;
}
