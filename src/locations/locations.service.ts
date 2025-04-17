import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const location = this.locationRepository.create(createLocationDto);
    return this.locationRepository.save(location);
  }

  async findAll(): Promise<Location[]> {
    return this.locationRepository.find({ relations: ['devices'] });
  }

  async findOne(id: number): Promise<any> {
    return this.locationRepository.findOne({ 
      where: { id },
      relations: ['devices'] 
    });
  }

  async findOneByName(name: string): Promise<any> {
    return this.locationRepository.findOne({ 
      where: { name },
      relations: ['devices'] 
    });
  }

  async update(id: number, updateLocationDto: UpdateLocationDto): Promise<Location> {
    await this.locationRepository.update(id, updateLocationDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.locationRepository.delete(id);
  }
}