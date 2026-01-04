import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { outcomes } from '@app/common';

@outcomes.Driver
@Controller()

export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  create(@Payload() createDriverDto: CreateDriverDto) {
    return this.driversService.create(createDriverDto);
  }

  findAll() {
    return this.driversService.findAll();
  }

  findOne(@Payload() id: number) {
    return this.driversService.findOne(id);
  }

  update(@Payload() updateDriverDto: UpdateDriverDto) {
    return this.driversService.update(updateDriverDto.id, updateDriverDto);
  }

  remove(@Payload() id: number) {
    return this.driversService.remove(id);
  }
}
