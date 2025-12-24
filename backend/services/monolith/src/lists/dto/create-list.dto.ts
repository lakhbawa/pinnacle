import {IsInt, IsNotEmpty, isNumber, IsOptional, IsString, MaxLength, MinLength} from "class-validator";

export class CreateListDto {

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    @MinLength(2)
    title: string

    @IsNotEmpty()
    project_id: string

    @IsOptional()
    order: number | undefined;
}
