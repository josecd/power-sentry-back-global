export class UpdateShellyDto {
  name?: string;
  ipAddress?: string;
  idDeviceApi?: number;

  description?: string;
  isOn?: boolean;
  latitude?: number;
  longitude?: number;
  weatherControlEnabled?: boolean;
  turnOnWhenRain?: boolean;
  turnOnWhenTempBelow?: number;
  turnOnWhenTempAbove?: number;

  sunriseSunsetControl?: boolean;
  turnOnAtSunrise?: boolean;
  turnOffAtSunset?: boolean;

}