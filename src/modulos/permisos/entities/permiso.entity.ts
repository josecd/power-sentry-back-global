import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Permiso {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    nombre: string;

    @Column({ unique: true })
    identificador: string;
  
    @Column()
    descripcion: string;
}
