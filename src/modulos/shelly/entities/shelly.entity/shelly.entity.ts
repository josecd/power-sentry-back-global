import { Location } from 'src/modulos/locations/entities/location.entity';
import { Usuario } from 'src/modulos/usuarios/entities/usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany } from 'typeorm';

@Entity()
export class ShellyDevice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  idDeviceApi: number;

  @Column()
  ipAddress: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isOn: boolean;

  @Column({ type: 'float', nullable: true })
  power: number;

  @Column({ type: 'float', nullable: true })
  energy: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdated: Date;

  // Nuevos campos para control climático
  @Column({ nullable: true })
  locationKey: string;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @Column({ default: false })
  weatherControlEnabled: boolean;

  @Column({ nullable: true })
  turnOnWhenRain: boolean;

  @Column({ nullable: true })
  turnOnWhenTempBelow: number;

  @Column({ nullable: true })
  turnOnWhenTempAbove: number;

  //

  @Column({ default: false })
  sunriseSunsetControl: boolean;

  @Column({ nullable: true })
  turnOnAtSunrise: boolean;

  @Column({ nullable: true })
  turnOffAtSunset: boolean;

  @Column({ nullable: true })
  sunriseTime: string;  // Formato "HH:MM"

  @Column({ nullable: true })
  sunsetTime: string;   // Formato "HH:MM"

  // Relación inversa
  @ManyToMany(() => Usuario, usuario => usuario.devicesAccesibles)
  usuariosConAcceso: Usuario[];

  @ManyToOne(() => Location, (location) => location.devices, { nullable: true })
  location: Location;

  @Column({ nullable: true })
  apiUrl: string;


}