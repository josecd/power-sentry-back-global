import { Injectable, Logger,  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateShellyDto } from './dto/create-shelly.dto';
import { UpdateShellyDto } from './dto/update-shelly.dto';
import { ShellyResponse, ShellyStatus } from './interfaces/shelly.interface';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ShellyDevice } from './entities/shelly.entity/shelly.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ShellyService {
    private readonly logger = new Logger(ShellyService.name);
  
  constructor(
    @InjectRepository(ShellyDevice)
    private shellyRepository: Repository<ShellyDevice>,
    private httpService: HttpService,
  ) {}

  async toogleApi(id, action){

    try {
      const device = await this.shellyRepository.findOne({ 
        where: { id },
        relations: ['location'] 
      });
      if (!device) {
        throw new Error('Dispositivo no encontrado');
      }
      const urlApi = `${device.location?.apiUrl}/shelly/${device.idDeviceApi}/toogle/${action}`
      console.log("Url api", urlApi);
      const response = await firstValueFrom(
        this.httpService.get<ShellyStatus>(urlApi),
      );
  
      console.log("Response", response);
      
      return response.data
    } catch (error) {
      return { isok: false, error: error.message };
      
    }

  
  }

  async create(createShellyDto: CreateShellyDto): Promise<ShellyDevice> {
    const device = this.shellyRepository.create(createShellyDto);
    return this.shellyRepository.save(device);
  }

  async findAll(): Promise<ShellyDevice[]> {
    return this.shellyRepository.find();
  }

  async findOne(id: number): Promise<any> {
    return this.shellyRepository.findOne({ where: { id } });
  }

  async update(id: number, updateShellyDto: UpdateShellyDto): Promise<any> {
    await this.shellyRepository.update(id, updateShellyDto);
    return this.shellyRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.shellyRepository.delete(id);
  }

  async getDeviceStatus(ipAddress: string): Promise<ShellyResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<ShellyStatus>(`http://${ipAddress}/rpc/Switch.GetStatus?id=0`),
      );
      return { isok: true, data: response.data };
    } catch (error) {
      return { isok: false, error: error.message };
    }
  }

  async updateDeviceMetrics(ipAddress: string): Promise<ShellyResponse> {
    try {
      const statusResponse = await this.getDeviceStatus(ipAddress);
      if (!statusResponse.isok) {
        return statusResponse;
      }
  
      const status = statusResponse.data;
      const device = await this.shellyRepository.findOne({ where: { ipAddress } });
      
      if (device) {
  
        // Actualizar dispositivo
        device.isOn = status.ison;
        device.power = status.apower;
        device.energy = status.aenergy.total;
        device.lastUpdated = new Date();
        await this.shellyRepository.save(device);
      }
  
      return { isok: true, data: device };
    } catch (error) {
      return { isok: false, error: error.message };
    }
  }

  // Programar chequeos periódicos (ejemplo cada hora)
  /* @Cron('0 * * * *') // Cada hora en el minuto 0 */
  async scheduledWeatherCheck() {
    console.log("Activate scheduledWeatherCheck ");
    
    const devices = await this.shellyRepository.find({ 
      where: { weatherControlEnabled: true } 
    });
    
    for (const device of devices) {
      //await this.checkAndUpdateBasedOnWeather(device.id);
    }
  }

}