import {IsInt, IsNotEmpty, isNumber, IsString, MaxLength, MinLength} from "class-validator";

export class CreateListDto {

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    @MinLength(5)
    title: string

    @IsNotEmpty()
    project_id: string

    @IsInt()
    order: number | null
}
