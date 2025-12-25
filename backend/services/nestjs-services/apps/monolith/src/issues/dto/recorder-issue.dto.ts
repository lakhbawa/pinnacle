import {Optional} from "@nestjs/common";
import {IsOptional} from "class-validator";

export class ReorderIssueDto {
  @IsOptional()
  beforeIssueId?: string; // null = move to start
  @IsOptional()
  afterIssueId?: string;  // null = move to end
  @IsOptional()
  listId?: string;     // optional: change column
}