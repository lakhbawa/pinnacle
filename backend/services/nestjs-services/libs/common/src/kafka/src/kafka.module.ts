import {KafkaService} from "./kafka.service";
import {Module, Global} from "@nestjs/common";

@Global()
@Module({
    imports: [],
    providers: [KafkaService],
    exports: [KafkaService]
})

export class KafkaModule {}

