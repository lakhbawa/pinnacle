import { Controller } from '@nestjs/common';
import { FocusService } from './focus.service';
import {ActiveFocusDataRequest, ActiveFocusDataResponse,
  FocusServiceController,
  FocusServiceControllerMethods
} from "@app/common/types/outcomes_service/v1/focus";
import {OutcomeMapper} from "../mappers/outcome.mapper";

@Controller()
@FocusServiceControllerMethods()
export class FocusController implements FocusServiceController {
  constructor(private readonly focusService: FocusService) {
  }

  async getActiveFocusData(request: ActiveFocusDataRequest): Promise<ActiveFocusDataResponse> {
      console.log("Reached method");
        const outcomes =  await this.focusService.getActiveFocusData(request);
        return {
            data: outcomes.map((o) => OutcomeMapper.toProto(o)),
        };
  }
}
