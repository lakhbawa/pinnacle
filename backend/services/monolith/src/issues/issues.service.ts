import {Injectable, InternalServerErrorException} from '@nestjs/common';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import {PrismaService} from "../prisma.service";

@Injectable()
export class IssuesService {

  constructor(private prisma : PrismaService) {
  }

  async create(createIssueDto: CreateIssueDto) {
    try {
      return await this.prisma.issue.create({
        data: {
          title: createIssueDto.title,
          listId: createIssueDto.listId,
          dueDate: createIssueDto.dueDate
        }
      })

    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    return await this.prisma.issue.findMany();
  }

  findOne(id: string) {
    const issue =  this.prisma.issue.findFirst({
      where: {
        id: id
      }
    })
    if (!issue) {
      throw new InternalServerErrorException('Not Found');
    }
    return issue;
  }

  async update(id: string, updateIssueDto: UpdateIssueDto) {
    
    try {
      const data: any = {};
      if (updateIssueDto.title) {
        data.title = updateIssueDto.title;
      }
      if (updateIssueDto.listId) {
        data.listId = updateIssueDto.listId;
      }
      if (updateIssueDto.dueDate) {
        data.dueDate = updateIssueDto.dueDate;
      }

      return await this.prisma.issue.update({
        where: {
          id: id
        },
        data
      })
      
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.issue.delete({
        where: {
          id: id
        }
      })
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
