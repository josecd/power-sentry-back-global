import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { IsNull } from 'typeorm';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @MinLength(3)
  nombre: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  contraseña: string;

  @IsNotEmpty()
  roles:any;
}