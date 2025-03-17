import { IsString, IsNotEmpty } from 'class-validator';

export class CrearPermisoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  identificador: string;

  @IsString()
  descripcion: string;
}