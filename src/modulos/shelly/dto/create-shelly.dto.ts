export class CreateShellyDto {
  name: string;
  idDeviceApi?:number;
  ipAddress: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  weatherControlEnabled?: boolean;
  turnOnWhenRain?: boolean;
  turnOnWhenTempBelow?: number;
  turnOnWhenTempAbove?: number;
}