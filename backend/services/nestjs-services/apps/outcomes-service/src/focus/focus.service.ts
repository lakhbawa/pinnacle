import { Injectable } from '@nestjs/common';
import {OutcomesService} from "../outcomes/outcomes.service";
import { Prisma, Outcome } from '../generated/prisma-client';
import {PrismaService} from "../prisma.service";
import {ActiveFocusDataRequest} from "@app/common/types/outcomes_service/v1/focus";
@Injectable()
export class FocusService {

    constructor(private readonly outcomeService: OutcomesService, private prisma: PrismaService) {

    }

        async count(params: { where?: Prisma.OutcomeWhereInput }): Promise<number> {
        return this.prisma.outcome.count(params);
    }

    async getActiveFocusData(request: ActiveFocusDataRequest) {
        return await this.outcomeService.findAll({ include: {
    drivers: {
      include: {
        actions: true
      }
    }
  }});
    }
}
