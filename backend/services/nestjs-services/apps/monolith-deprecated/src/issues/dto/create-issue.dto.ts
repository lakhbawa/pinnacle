import {IsDate, IsDateString, IsNotEmpty, IsOptional, MaxLength, MinLength} from "class-validator";

export class CreateIssueDto {
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(255)
    title: string

    @IsNotEmpty()
    listId: string

    @IsDateString()
    @IsOptional()
    dueDate?: string

    @IsOptional()
    afterIssueId?: string
    @IsOptional()
    beforeIssueId?: string
}
