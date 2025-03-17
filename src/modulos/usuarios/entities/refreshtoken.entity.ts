import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  expiracion: Date; // Fecha de expiración del token

  @ManyToOne(() => Usuario, (usuario) => usuario.refreshTokens)
  usuario: Usuario; // Relación con el usuario
}