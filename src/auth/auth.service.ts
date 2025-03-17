import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsuariosService } from 'src/modulos/usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from 'src/modulos/usuarios/entities/refreshtoken.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

 
  async validateUser(email: string, password: string): Promise<any> {
    const usuario = await this.usuariosService.validarUsuario(email, password);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return usuario;
  }

  async login(usuario: any) {
    const payload = { email: usuario.email, sub: usuario.id, roles: usuario.roles };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Guardar el refresh token en la base de datos
    await this.usuariosService.guardarRefreshToken(usuario.id, refreshToken);

    return {
      email: usuario.email,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async logout(userId: number, token: string) {
    // Revocar el token específico
    await this.usuariosService.revocarToken(userId, token);
  }

  async logoutAll(userId: number) {
    // Revocar todos los tokens del usuario
    await this.usuariosService.revocarTodosLosTokens(userId);
  }

  async refreshAccessToken(userId: number, refreshToken: string) {
    // Validar el refresh token
    const isValid = await this.usuariosService.validarRefreshToken(userId, refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    // Generar un nuevo access token
    const usuario = await this.usuariosService.obtenerUsuarioPorId(userId);
    const payload = { email: usuario.email, sub: usuario.id, roles: usuario.roles };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    return {
      access_token: accessToken,
    };
  }
}
