import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ShellyController } from './shelly.controller';
import { ShellyService } from './shelly.service';
import { ShellyDevice } from './entities/shelly.entity/shelly.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
  TypeOrmModule.forFeature([ShellyDevice]), 
  HttpModule, 
  ScheduleModule.forRoot(),
],
  controllers: [ShellyController],
  providers: [ShellyService],
  exports: [ShellyService]
})
export class ShellyModule {}