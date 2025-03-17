import { Permiso } from "src/modulos/permisos/entities/permiso.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    nombre: string;

    @Column()
    descripcion: string;
  
    @ManyToMany(() => Permiso)
    @JoinTable()
    permisos: Permiso[];
}
