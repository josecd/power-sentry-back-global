import { Exclude } from "class-transformer";
import { Role } from "src/modulos/roles/entities/role.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RefreshToken } from "./refreshtoken.entity";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    nombre: string;
  
    @Column({ unique: true })
    email: string;
  
    @Exclude()
    @Column()
    contraseña: string;
  
    @ManyToMany(() => Role)
    @JoinTable()
    roles: Role[];

    @OneToMany(() => RefreshToken, (token) => token.usuario)
    refreshTokens: RefreshToken[]; // Relación con múltiples tokens
}

