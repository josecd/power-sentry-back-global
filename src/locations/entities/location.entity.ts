import { ShellyDevice } from 'src/modulos/shelly/entities/shelly.entity/shelly.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  apiUrl: string;

  @Column({ type: 'json', nullable: true })
  apiConfig: Record<string, any>; // Para almacenar configuración específica de la API

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @Column({ nullable: true })
  timezone: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ShellyDevice, (device) => device.location)
  devices: ShellyDevice[];
}