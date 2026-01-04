import { Controller } from '@nestjs/common';
import { DriversService } from './drivers.service';
import {CreateDriverRequest, DeleteDriverRequest, DeleteDriverResponse,
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
      user_id:request.user_id
    });

    return DriverMapper.toProtoDriver(driver);
    }
    getDriver(request: GetDriverRequest): Promise<Driver> | Observable<Driver> | Driver {
        throw new Error('Method not implemented.');
    }
    listDrivers(request: ListDriversRequest): Promise<ListDriversResponse> | Observable<ListDriversResponse> | ListDriversResponse {
        throw new Error('Method not implemented.');
    }
    updateDriver(request: UpdateDriverRequest): Promise<Driver> | Observable<Driver> | Driver {
        throw new Error('Method not implemented.');
    }
    deleteDriver(request: DeleteDriverRequest): Promise<DeleteDriverResponse> | Observable<DeleteDriverResponse> | DeleteDriverResponse {
        throw new Error('Method not implemented.');
    }

}
