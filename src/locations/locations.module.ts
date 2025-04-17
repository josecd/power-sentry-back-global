import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { LocationController } from './locations.controller';
import { LocationService } from './locations.service';
import { ShellyDevice } from 'src/modulos/shelly/entities/shelly.entity/shelly.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location, ShellyDevice]), // Register both entities
  ],
  controllers: [LocationController
  ],
  providers: [LocationService],
  exports: [LocationService], // Export if you need to use the service in other modules
})
export class LocationsModule {}