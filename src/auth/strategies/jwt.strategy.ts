import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuariosService } from 'src/modulos/usuarios/usuarios.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usuariosService: UsuariosService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'tu_secreto', // Cambia esto por la misma clave secreta que usaste en JwtModule
    });
  }

  async validate(payload: any) {
    const usuario = await this.usuariosService.obtenerUsuarioPorId(payload.sub);
    if (!usuario) {
      throw new UnauthorizedException();
    }
    return usuario;
  }
}