import { Exclude } from "class-transformer";
import { Role } from "src/modulos/roles/entities/role.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RefreshToken } from "./refreshtoken.entity";
import { ShellyDevice } from "src/modulos/shelly/entities/shelly.entity/shelly.entity";
import { Location } from "src/modulos/locations/entities/location.entity";

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

    // Relación ManyToMany con índice explícito
    @ManyToMany(() => Location, location => location.usuariosConAcceso)
    @JoinTable({
        name: 'usuario_location_access', // Nombre personalizado para la tabla JOIN
        joinColumn: { name: 'usuario_id' },
        inverseJoinColumn: { name: 'location_id' }
    })
    locationsAccesibles: Location[];

    // Relación ManyToMany optimizada
    @ManyToMany(() => ShellyDevice, device => device.usuariosConAcceso)
    @JoinTable({
        name: 'usuario_device_access',
        joinColumn: { name: 'usuario_id' },
        inverseJoinColumn: { name: 'device_id' }
    })
    devicesAccesibles: ShellyDevice[];
}

