import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUsuarioDto {
  @IsNotEmpty()
  @MinLength(3)
  nombre: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  contraseña: string;
}