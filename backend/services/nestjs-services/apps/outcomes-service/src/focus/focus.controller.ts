import {Controller, Inject} from '@nestjs/common';
import { FocusService } from './focus.service';
import {ActiveFocusDataRequest, ActiveFocusDataResponse,
  FocusServiceController,
  FocusServiceControllerMethods
} from "@app/common/types/outcomes_service/v1/focus";
import {OutcomeMapper} from "../mappers/outcome.mapper";
import {ClientKafka} from "@nestjs/microservices";

@Controller()
@FocusServiceControllerMethods()
export class FocusController implements FocusServiceController {
  constructor(private readonly focusService: FocusService, @Inject('KAFKA_SERVICE') private kafka: ClientKafka) {
  }
  async onModuleInit() {
    await this.kafka.connect();
  }

  async getActiveFocusData(request: ActiveFocusDataRequest): Promise<ActiveFocusDataResponse> {

    this.kafka.emit('active_focus.request', {
      message: "First Message",
      timestamp: new Date().toISOString(),
    });

      console.log("Reached method");
        const outcomes =  await this.focusService.getActiveFocusData(request);
        return {
            data: outcomes.map((o) => OutcomeMapper.toProto(o)),
        };
  }
}
