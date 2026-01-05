import {Controller} from '@nestjs/common';
import {DriversService} from './drivers.service';
import {
    CreateDriverRequest, DeleteDriverRequest, DeleteDriverResponse,
    DriversServiceController,
    DriversServiceControllerMethods,
    GetDriverRequest,
    ListDriversRequest,
    ListDriversResponse,
    UpdateDriverRequest
} from "@app/common/types/outcomes_service/v1/drivers";
import {Driver} from '@app/common/types/outcomes_service/v1/models';
import {Observable} from 'rxjs';
import {formatZodErrors} from "@app/common/helpers/validation/utils";
import {RpcException} from "@nestjs/microservices";
import {Status} from "@grpc/grpc-js/build/src/constants";
import {createDriverSchema} from "../validators/outcomes-service.schema";
import {DriverMapper} from "../mappers/driver.mapper";
import {getPagination, getPaginationMeta} from "@app/common/helpers/pagination";
import {Prisma} from '../generated/prisma-client';

@Controller()
@DriversServiceControllerMethods()
export class DriversController implements DriversServiceController {
    constructor(private readonly driversService: DriversService) {
    }

    async createDriver(request: CreateDriverRequest): Promise<Driver> {
        console.log('Received request2:', JSON.stringify(request, null, 2));
        const result = createDriverSchema.safeParse(request);

        if (!result.success) {
            const errors = formatZodErrors(result.error);

            throw new RpcException({
                code: Status.INVALID_ARGUMENT,
                message: JSON.stringify(errors),
            });
        }

        const driver = await this.driversService.create({
            title: request.title,
            outcome: {
                connect: {
                    id: request.outcome_id
                }
            },
            user_id: request.user_id
        });

        return DriverMapper.toProtoDriver(driver);
    }

    async getDriver(request: GetDriverRequest): Promise<Driver> {
        const driver = await this.driversService.findOne(
            {id: request.id},
        );
        if (!driver) {
            throw new RpcException({
                code: Status.NOT_FOUND,
                message: 'Outcome not found',
            });
        }
        return DriverMapper.toProtoDriver(driver);
    }

    async listDrivers(request: ListDriversRequest): Promise<ListDriversResponse> {
        const where: Prisma.DriverWhereInput = {};

        if (request.user_id) {
            where.user_id = request.user_id;
        }
        if (request.outcome_id) {
            where.outcome_id = request.outcome_id;
        }
        const {pageSize, currentPage, skip} = getPagination(request);

        const [totalCount, outcomes] = await Promise.all([
            this.driversService.count({where}),
            this.driversService.findAll({
                where,
                skip,
                take: pageSize,
                include: {
                    actions: true,
                },
                orderBy: {created_at: 'desc'},
            }),
        ]);

        const meta = getPaginationMeta(totalCount, pageSize, currentPage);

        return {
            data: outcomes.map((o) => DriverMapper.toProtoDriver(o)),
            ...meta,
        };
    }

    async updateDriver(request: UpdateDriverRequest): Promise<Driver> {
        const data: Prisma.DriverUpdateInput = {};
        if (request.title) data.title = request.title;

        const driver = await this.driversService.update({where: {id: request.id}, data});
        return DriverMapper.toProtoDriver(driver);
    }

    async deleteDriver(request: DeleteDriverRequest): Promise<DeleteDriverResponse> {
        await this.driversService.remove({id: request.id});
        return {success: true};
    }

}
