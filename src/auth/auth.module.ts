import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuariosModule } from 'src/modulos/usuarios/usuarios.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsuariosModule, // Importa el módulo de usuarios para usar el servicio de usuarios
    PassportModule.register({ defaultStrategy: 'jwt' }), // Configura Passport para JWT
    JwtModule.register({
      secret: 'tu_secreto', // Cambia esto por una clave secreta segura
      signOptions: { expiresIn: '1h' }, // Tiempo de expiración del token
    }),
    UsuariosModule
  ],
  providers: [AuthService, JwtStrategy], // Provee el servicio y la estrategia JWT
  controllers: [AuthController], // Controlador de autenticación
  exports: [JwtStrategy, PassportModule], // Exporta la estrategia y Passport para su uso en otros módulos
})
export class AuthModule {}
