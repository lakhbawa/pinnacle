import {Injectable, Logger} from '@nestjs/common';
import { PrismaService } from "../prisma.service";
import { Prisma, Outcome } from '../generated/prisma-client';
import {KafkaService} from "@app/common/kafka/src/kafka.service";
import {OutcomeCreatedEvent} from "@app/common/kafka/src/interfaces/kafka-message.interface";

@Injectable()
export class OutcomesService {

    private readonly logger = new Logger('OutcomesService');

    constructor(private prisma: PrismaService, private kafkaService: KafkaService) {}

    async create(data: Prisma.OutcomeCreateInput): Promise<Outcome> {

        this.logger.log(`Creating outcome ${JSON.stringify(data)}`);

        const outcome =  await this.prisma.outcome.create({ data });

        const outcomeCreatedEvent: OutcomeCreatedEvent = {
            outcomeId: outcome.id,
            userId: outcome.user_id,
            title: outcome.title
        }

        await this.kafkaService.publish(
            'outcomes-events',
            'OUTCOME_CREATED',
            outcomeCreatedEvent,
            outcome.user_id
        )
        return outcome;
    }

    async count(params: { where?: Prisma.OutcomeWhereInput }): Promise<number> {
        return this.prisma.outcome.count(params);
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.OutcomeWhereUniqueInput;
        where?: Prisma.OutcomeWhereInput;
        orderBy?: Prisma.OutcomeOrderByWithRelationInput;
        include?: Prisma.OutcomeInclude;
    }): Promise<Outcome[]> {
        const { skip, take, cursor, where, orderBy, include } = params;
        return this.prisma.outcome.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include,
        });
    }

    async findOne(
        where: Prisma.OutcomeWhereUniqueInput,
        include?: Prisma.OutcomeInclude
    ): Promise<Outcome | null> {
        return this.prisma.outcome.findUnique({ where, include });
    }

    async update(params: {
        where: Prisma.OutcomeWhereUniqueInput;
        data: Prisma.OutcomeUpdateInput;
    }): Promise<Outcome> {
        const { data, where } = params;
        return this.prisma.outcome.update({ data, where });
    }

    async remove(where: Prisma.OutcomeWhereUniqueInput): Promise<Outcome> {
        return this.prisma.outcome.delete({ where });
    }
}