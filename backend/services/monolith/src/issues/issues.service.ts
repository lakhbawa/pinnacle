import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {Issue, Prisma} from "@prisma/client";
import {LexicographicOrderGenerator} from "../utils/lexicographicOrder.util";
import {ReorderIssueDto} from "./dto/recorder-issue.dto";

@Injectable()
export class IssuesService {

    constructor(private prisma: PrismaService) {
    }

    async create(data: Prisma.IssueCreateInput) {

        return await this.prisma.issue.create({
            data
        })

    }


    async findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.IssueWhereUniqueInput;
        where?: Prisma.IssueWhereInput;
        orderBy?: Prisma.IssueOrderByWithRelationInput;
        include?: Prisma.IssueInclude;
    }): Promise<Issue[]> {
        const {skip, take, cursor, where, orderBy, include} = params;
        return this.prisma.issue.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include,
        });
    }

    findOne(where: Prisma.IssueWhereUniqueInput) {
        return this.prisma.issue.findUnique({
            where
        });
    }

    async update(params: {
        where: Prisma.IssueWhereUniqueInput;
        data: Prisma.IssueUpdateInput;
    }) {
        const {data, where} = params;
        return await this.prisma.issue.update({
            data,
            where,
        })

    }


    async remove(where: Prisma.IssueWhereUniqueInput): Promise<Issue> {
        return this.prisma.issue.delete({
            where
        })

    }

    /**
   * Reorders a task - super simple!
   */
  async reorder(userId: string, issueId: string, dto: ReorderIssueDto): Promise<Issue> {
    const issue = await this.prisma.issue.findUnique({
      where: { id: issueId, userId },
    });

    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    const targetListId = dto.listId || issue.listId;

    const position = await this.calculatePosition(
      userId,
      targetListId,
      dto.beforeIssueId,
      dto.afterIssueId,
      issueId, // Exclude current issue from calculations
    );
        console.log("position", position);

    issue.position = position;
    issue.listId = targetListId;
    issue.updatedAt = new Date();

    return await this.prisma.issue.update({
            data: issue,
            where: {
                id: issueId,
            },
        })
  }

    /**
   * CORE LOGIC: Calculates position for any scenario
   * This is the only place where positioning logic lives!
   */
    async calculatePosition(
    userId: string,
    listId: string,
    beforeIssueId?: string,
    afterIssueId?: string,
    excludeIssueId?: string,
  ): Promise<string> {
    // Get sorted tasks in the column
    let tasks = await this.prisma.issue.findMany({
      where: { userId, listId },
      orderBy: { position: 'asc' },
    });

    // Exclude current task if reordering
    if (excludeIssueId) {
      tasks = tasks.filter(t => t.id !== excludeIssueId);
    }

    // Find the before and after positions
    let beforePosition: string | null = null;
    let afterPosition: string | null = null;

    if (beforeIssueId) {
      const beforeTask = tasks.find(t => t.id === beforeIssueId);
      if (beforeTask) {
        beforePosition = beforeTask.position;
      }
    }

    if (afterIssueId) {
      const afterTask = tasks.find(t => t.id === afterIssueId);
      if (afterTask) {
        afterPosition = afterTask.position;
      }
    }

    // If no specific position requested, add to end
    if (!beforeIssueId && !afterIssueId && tasks.length > 0) {
      afterPosition = tasks[tasks.length - 1].position;
    }

    // Generate position - one line!
    return LexicographicOrderGenerator.generateBetween(afterPosition, beforePosition);
  }
}
