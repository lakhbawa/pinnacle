import {Module} from '@nestjs/common';
import {OutcomesModule} from './outcomes/outcomes.module';
import {ConfigModule} from "@nestjs/config";
import appConfig from "@app/common/config/app.config";
import {DriversModule} from "./drivers/drivers.module";
import {ActionsModule} from "./actions/actions.module";
import {FocusModule} from "./focus/focus.module";
import {SuccessMetricsModule} from "./success-metrics/success-metrics.module";

import { APP_INTERCEPTOR } from '@nestjs/core';
import { MetricsModule } from './metrics/metrics.module';
import { MetricsInterceptor } from './interceptors/metrics.interceptor';
import { CustomMetricsService } from './metrics/custom-metrics.service';

@Module({
    imports: [MetricsModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: [
        'apps/outcomes-service/.env',
        '.env'
    ],
    load: [appConfig],
    expandVariables: true,
}),
        OutcomesModule, DriversModule, ActionsModule, FocusModule, SuccessMetricsModule],
    controllers: [],
    providers: [
        CustomMetricsService,
        {
            provide: APP_INTERCEPTOR,
            useClass: MetricsInterceptor,
        }
    ],
})
export class OutcomesServiceModule {
}
